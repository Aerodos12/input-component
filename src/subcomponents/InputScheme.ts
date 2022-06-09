import Signal from "@rbxts/signal";
import { InputKind, InputSignal } from "../inputTypes";
import { AxisDataFormat, AxisRotationMode } from "./inputAxis";

namespace InputSchemeSC {
	export enum InputObjectType {
		Axis,
		Action,
	}

	/**
	 * A function that creates an action.
	 */
	export type InputSchemeActionProcessor = (
		self: InputScheme,
		name: String,
		inputCodes: Array<InputKind>,
		hold: boolean,
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
		keyCode: Enum.KeyCode,
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
		Name: String;
		Actions: Array<String>;
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
	}
}

export = InputSchemeSC;
