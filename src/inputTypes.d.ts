import Signal from "@rbxts/signal";
/**
 * Used for console {@link InputKind inputs} only.
 */
export type GamepadButtonCode =
	| Enum.KeyCode.ButtonA
	| Enum.KeyCode.ButtonB
	| Enum.KeyCode.ButtonX
	| Enum.KeyCode.ButtonY
	| Enum.KeyCode.ButtonL1
	| Enum.KeyCode.ButtonL2
	| Enum.KeyCode.ButtonL3
	| Enum.KeyCode.ButtonR1
	| Enum.KeyCode.ButtonR2
	| Enum.KeyCode.ButtonR3
	| Enum.KeyCode.ButtonSelect
	| Enum.KeyCode.ButtonStart
	| Enum.KeyCode.DPadDown
	| Enum.KeyCode.DPadLeft
	| Enum.KeyCode.DPadRight
	| Enum.KeyCode.DPadUp
	| Enum.KeyCode.DPadDown;

/**
 * Used for all three mouse buttons.
 */
export type MouseType =
	| Enum.UserInputType.MouseButton1
	| Enum.UserInputType.MouseButton2
	| Enum.UserInputType.MouseButton3;

/**
 * Used to identified the type of input currently being used.
 */
export type Platform = "Gamepad" | "Keyboard" | "Touch" | "VR";

/**
 * A function that determines if the platform it represents is currently avaialable.
 */
export type DeviceSelector = () => boolean;
/**
 * A map of all of the supported platforms and the {@link DeviceSelector selector functioons} that choose them.
 */
export type DeviceSelectorMap = Map<Platform, DeviceSelector>;
/**
 * Represents mouse, keyboard and gamepad inputs.
 */
export type InputKind = Enum.KeyCode | MouseType;

/**
 * Represents the "pressed" state of most {@link InputKind inputs}.
 */
export type PressedState = Map<InputKind, boolean>;
/**
 * Used for detecting key input events.
 */
export type KeyDownSignal = Signal<(key: Enum.KeyCode, isDown: boolean) => void>;
/**
 * Used for detecting gamepad input events.
 */
export type GamepadDownSignal = Signal<(button: Enum.KeyCode, isDown: boolean) => void>;
/**
 * Used for handling mouse button input events.
 */
export type MouseDownSignal = Signal<(key: MouseType, isDown: boolean) => void>;
/**
 * Denotes one of the 8 Gamepads that can be connected at once to Roblox.
 */
export type GamepadType =
	| Enum.UserInputType.Gamepad1
	| Enum.UserInputType.Gamepad2
	| Enum.UserInputType.Gamepad3
	| Enum.UserInputType.Gamepad4
	| Enum.UserInputType.Gamepad5
	| Enum.UserInputType.Gamepad6
	| Enum.UserInputType.Gamepad7
	| Enum.UserInputType.Gamepad8
	| Enum.UserInputType.None;
/**
 * An interface used for configuring mouse sensitivity globally in Rodblogan Warfare.
 * @interface
 * @public
 */
export interface SensitivityOptions {
	mouse: number;
	aim: number;
	touch: Vector2;
}
/**
 * Map used for polled inputs on console.
 */
export type PolledGamepadMap = Map<InputKind, InputObject>;

/**
 * Corresponds to the gamepad section of the player's custom inputs.
 */
export type GamepadBindDefinition = Map<String, InputKind | undefined>;
/**
 * Corresponds to the keyboard section of the player's custom inputs.
 */
export type KeyboardBindDefinition = Map<String, InputKind | undefined>;
/**
 * Represents a part of the player's custom inputs.
 */
/**
 *  Represents a part of the player's custom inputs.
 */
export type BindMap = {
	[key in Platform]: GamepadBindDefinition | KeyboardBindDefinition;
};
/**
 * Represents ALL of the player's custom inputs.
 */
export type BindDatum = Map<String, BindMap>;
/**
 * Input plugin function used for polled inputs.
 */
export type RenderSteppedInputPlugin = (dt: number) => boolean;
/**
 * Input plugin function used when an input is pressed.
 */
export type InputBeganPlugin = (input: InputObject, g: boolean) => boolean;
/**
 * Input plugin function used when an input is released.
 */
export type InputReleasedPlugin = (input: InputObject, g: boolean) => boolean;
/**
 * Input plugin function used when an input has changed.
 */
export type InputChangedPlugin = (input: InputObject, g: boolean) => boolean;
/**
 * Input plugin function used when the game window has regained its focus.
 */
export type WindowFocusedPlugin = () => boolean;
/**
 * Represents all Input Plugin types.
 */
export type InputPlugin =
	| RenderSteppedInputPlugin
	| InputBeganPlugin
	| InputChangedPlugin
	| InputReleasedPlugin
	| WindowFocusedPlugin;

export enum InputPluginType {
	RenderStepped,
	InputBegan,
	InputChanged,
	InputReleased,
	WindowFocused,
}
