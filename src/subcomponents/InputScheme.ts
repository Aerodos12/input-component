import Signal from "@rbxts/signal";
import { ListenToKeyChanged } from "..";
import { InputKind, InputSignal } from "../inputTypes";
import { AxisDataFormat, AxisRotationMode } from "./inputAxis";
const UIS = game.GetService("UserInputService");

namespace InputSchemeSC {
	export enum InputObjectType {
		Axis,
		Action,
	}

	/**
	 * Used for InputAxes only.
	 */
	export type NullableKeycode = Enum.KeyCode | false;

	/**
	 * Defines the code for  an action.
	 */
	export type InputActionRunner = (inputObj: InputObject, gameProcessed: boolean) => void;

	/**
	 * A function that creates an action.
	 */
	export type InputSchemeActionProcessor = (
		self: InputScheme,
		name: String,
		inputCodes: Array<InputKind>,
		hold: boolean,
		onRun: InputActionRunner,
		existing: boolean,
		mode: number,
	) => void;

	/**
	 * A function that creates an {@link InputAxis}.
	 */
	export type InputSchemeAxisProcessor = (
		self: InputScheme,
		name: String,
		uit: Enum.UserInputType,
		dataType: AxisDataFormat,
		keyCode: NullableKeycode,
		polled: boolean,
		rotMode: AxisRotationMode,
	) => RBXScriptConnection;

	export type InputSchemeProcessor = InputSchemeActionProcessor | InputSchemeAxisProcessor | undefined;

	/**
	 * Used to register {@link InputSchemeProcessor InputSchemeProcessors}.
	 */
	export type InputTypeRegistry = Map<InputObjectType, InputSchemeProcessor>;

	/**
	 * The basic building block for InputSchemes.
	 * @interface
	 */
	export interface InputSchemeAction {
		/**
		 * Called when the action is correctly triggered.
		 */
		onRun: (actionName: String, i: InputObject, gp: boolean) => void;
		/**
		 * Determines whether or not the action is held first.
		 */
		hold: boolean;
		/**
		 * An array of {@link InputKind inputs} that can be used to correctly trigger the action.
		 */
		actionInputs: Array<InputKind>;
	}

	/**
	 * Used for defining input modes.
	 * @interface
	 */
	export interface ModeManifest {
		/**
		 * The name of this mode.
		 */
		Name: String;
		/**
		 * The actions that can be performed with this mode.
		 */
		Actions: Array<String>;
	}

	/**
	 * Used for registering axes
	 * @interface
	 */
	export interface AxisArgs {
		/**
		 * The name of the axis.
		 */
		name: String;
		/**
		 * Specifies the valid type of input(s) the axis would work with.
		 */
		uit: Enum.UserInputType;
		/**
		 * How the axis data ({@link AxisDataFormat the format }) is processed.
		 */
		dataType: AxisDataFormat;
		/**
		 * The {@link Enum.KeyCode keys} that would be used if the input axis used the {@link Enum.UserInputType.Keyboard keyboard} and was {@link AxisDataFormat.Analog analog}.
		 */
		keyCode: NullableKeycode;
		/**
		 * Determines if the axis updates every frame or not (polling inputs).
		 */
		polled: boolean;
		/**
		 * Determines how the rotary inputs should be processed (using your code or this module's code).
		 */
		rotMode: AxisRotationMode;
	}

	/**
	 * Used for registering actions.
	 * @interface
	 */
	export interface ActionArgs {
		/**
		 * The name of the action.
		 */
		name: String;
		/**
		 * An array of inputs used with this action.
		 */
		inputCodes: Array<InputKind>;
		/**
		 * Whether or not the input should be held.
		 */
		hold: boolean;
		/**
		 * The action that is executed in code form.
		 */
		onRun: InputActionRunner;
		/**
		 * Should the registry use an existing mode from the mode list?
		 */
		existing: boolean;
		/**
		 * The mode index to use when on mobile or console.
		 */
		mode: number;
	}

	/**
	 * An object used for separating inputs by function.
	 */
	export class InputScheme {
		private registers: InputTypeRegistry = new Map<InputObjectType, InputSchemeProcessor>();

		/**
		 * Used for storing {@link ModeManifest input modes}.
		 * @public
		 */
		public Modes: Array<ModeManifest> = new Array<ModeManifest>();

		/**
		 * Fires when deactivated.
		 * @public
		 */
		public Deactivated: InputSignal = new Signal<(input: InputObject, gp: boolean) => void>();
		/**
		 * Fires the {@link Deactivated Deactivated event}.
		 * @param input The {@iink InputObject} to use for
		 * @param gp Whether or not the input is in a GUI (gameProcessed)
		 */
		private Deactivate(input: InputObject, gp: boolean): void {
			this.Deactivated.Fire(input, gp);
		}

		/**
		 * Property used for storing the actions themselves in this object.
		 */
		public ActionsLibrary: Map<string, InputSchemeAction> = new Map<string, InputSchemeAction>();

		/**
		 * Denotes the currently selected mode for this InputScheme.
		 */
		public Index = 1;

		/**
		 * Adds a {@link ModeManifest mode} to this InputScheme.
		 * @param mode The mode number to be used when pressing the {@link Enum.KeyCode.DPadDown down} or  {@link Enum.KeyCode.DPadUp up} buttons on the Dpad.
		 * @param name the name of the mode itself.
		 * @param actions The actions that are valid for this mode.
		 */
		AddMode(mode: number, name: String, actions: Array<String>) {
			assert(
				typeOf(mode) === "number" && math.floor(mode) === mode && mode > 0,
				"[InputComponent 2]: Mode Index must be an integer.",
			);
			assert(typeOf(name) === "string", "[InputComponent 2]: Mode Name must be a string.");
			this.Modes.insert(mode, {
				Name: name,
				Actions: actions,
			});
		}

		/**
		 * Registers the given input type into this {@link InputScheme}.
		 * @param inputObjectType The type of input to process
		 * @param args the setup parameters for {@link inputObjectType}
		 * @returns Either a {@link RBXScriptSignal} (if using an axis) or nothing at all.
		 */
		Register(inputObjectType: InputObjectType, args: AxisArgs | ActionArgs): RBXScriptConnection | undefined {
			if (inputObjectType === InputObjectType.Axis) {
				const args2 = args as AxisArgs;
				const axisFunc = this.registers.get(InputObjectType.Axis) as InputSchemeAxisProcessor;
				return axisFunc(
					this,
					args2.name,
					args2.uit,
					args2.dataType,
					args2.keyCode,
					args2.polled,
					args2.rotMode,
				);
			} else if (inputObjectType === InputObjectType.Action) {
				const args2 = args as ActionArgs;
				const actionFunc = this.registers.get(InputObjectType.Action) as InputSchemeActionProcessor;
				actionFunc(this, args2.name, args2.inputCodes, args2.hold, args2.onRun, args2.existing, args2.mode);
				return undefined;
			}
		}

		private actionFind(actionName: string): boolean {
			for (const i of this.Modes[this.Index].Actions) {
				if (i === actionName) {
					return true;
				}
			}
			return false;
		}

		/**
		 * Sets up a keybind/action that isn't polled via a connection.
		 * @param args The action's parameters
		 */
		RegisterAction(args: ActionArgs) {
			this.Register(InputObjectType.Action, args);
		}

		/**
		 * Sets up a keybind/action that is polled via a connection.
		 * @param args The axis' parameters
		 * @returns a signal used to process the axis.
		 */
		AddAxis(args: AxisArgs): RBXScriptConnection | undefined {
			return this.Register(InputObjectType.Axis, args);
		}

		/**
		 * Allows actions to be used on touch screens.
		 * @param actionName The name of the action
		 * @param button The button that will activate the action when touched.
		 * @returns a {@link RBXScriptConnection|connection} to the button being touched.
		 */
		RegisterActionButton(actionName: string, button: GuiButton): RBXScriptConnection {
			const run = (actionN: string, i2: InputObject, gp: boolean) => this.Run(actionN, i2, gp);
			return button.Activated.Connect(function (input: InputObject, clicks: number) {
				if (input.UserInputType === Enum.UserInputType.Touch) {
					if (input.UserInputState === Enum.UserInputState.End) {
						run(actionName, input, false);
					}
				}
			});
		}

		/**
		 * Checks to see if the mode contains the given action
		 * @param actionName the action to check against
		 * @returns Whether or not the actions fits.
		 */
		IsPartOfMode(actionName: string): boolean {
			return this.actionFind(actionName);
		}

		/**
		 * Performs the given action.
		 * @param actionName The name of the action
		 * @param i the input object to check against
		 * @param gp equivalent of gameProcessedEvent on InputBegan.
		 */
		Run(actionName: string, i: InputObject, gp: boolean) {
			let cond = false;
			if (UIS.GamepadEnabled && UIS.GetConnectedGamepads().size() > 0) {
				cond = this.IsPartOfMode(actionName);
			}
			if (cond) {
				const actionEntry = this.ActionsLibrary.get(actionName);
				if (actionEntry !== undefined) {
					actionEntry?.onRun(actionName, i, gp);
				}
			}
		}
	}
}

export = InputSchemeSC;
