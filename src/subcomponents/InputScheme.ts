import { InputKind } from "../inputTypes";
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
	 * An object used for separating inputs by function.
	 */
	export class InputScheme {
		private registers: InputTypeRegistry = new Map<InputObjectType, InputSchemeProcessor>();
	}
}

export = InputSchemeSC;
