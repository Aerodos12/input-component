/**
 * A library for creating user interactions via user input.
 *
 * @package
 */
import Signal from "@rbxts/signal";
import {
	GamepadButtonCode,
	MouseType,
	Platform,
	DeviceSelector,
	DeviceSelectorMap,
	InputKind,
	GamepadDownSignal,
	KeyDownSignal,
	MouseDownSignal,
	GamepadType,
	SensitivityOptions,
	PolledGamepadMap,
} from "./inputTypes";
import PressedHandler from "./pressedState";

const UIS: UserInputService = game.GetService("UserInputService");

namespace InputComponent {
	/**
	 * Event that fires when a gamepad button is pressed or released.
	 * @public
	 */
	export const GamepadButtonChanged: GamepadDownSignal = new Signal<
		(button: Enum.KeyCode, isDown: boolean) => void
	>();
	/**
	 * Event that fires when a key is pressed or released.
	 * @public
	 */
	export const KeyChanged: KeyDownSignal = new Signal<(key: Enum.KeyCode, isDown: boolean) => void>();
	/**
	 * Event that fires when a mouse button is pressed or released.
	 * @public
	 */
	export const MouseButtonChanged: MouseDownSignal = new Signal<(key: MouseType, isDown: boolean) => void>();
	export let CurrentPlatform: Platform = "Keyboard";
	export const PlatformChanged: Signal = new Signal<(platform: Platform) => void>();
	export let DeviceCount = 0;
	export const DeviceSelectors: DeviceSelectorMap = new Map<Platform, DeviceSelector>();
	/**
	 * Adds a function to a map of them that determines the value of {@link CurrentPlatform}.
	 *
	 * @param platform The platform that corresponds to this selector
	 * @param selector The actual function that determines how {@link CurrentPlatform} changes.
	 */
	export function AddDeviceSelector(platform: Platform, selector: DeviceSelector) {
		DeviceSelectors.set(platform, selector);
	}
	/**
	 * The state of every registered mouse button, key and/or gamepad button.
	 */
	export const Pressed: PressedHandler = new PressedHandler(GamepadButtonChanged, MouseButtonChanged, KeyChanged);
	{
		Enum.KeyCode.GetEnumItems().forEach(function (keyCode: Enum.KeyCode) {
			Pressed.setPressed(keyCode as InputKind, false);
		});
	}
	{
		Enum.UserInputType.GetEnumItems().forEach(function (mouseButton: Enum.UserInputType) {
			const mouseType = mouseButton as MouseType;
			if (mouseType === undefined) {
				return;
			}
			if (mouseType.Name.find("MouseButton")[0] === undefined) {
				return;
			}
			Pressed.setPressed(mouseType as InputKind, false);
		});
	}
	let ActiveGamepad: GamepadType | undefined = undefined;
	/**
	 * Determines the current scope of input (how inputs are handled within this library).
	 * @public
	 */
	export const CurrentIScheme = "General";
	export const Sensitivity: SensitivityOptions = {
		mouse: 0.3,
		aim: 0.2,
		touch: new Vector2(math.pi * 2.25, math.pi * 2),
	};
	/**
	 * Retrieves the currently active gamepad.
	 *
	 * @returns The current gamepad controller in use as a {@link GamepadType}
	 */
	export function GetActiveGamepad(): GamepadType | undefined {
		const navGamepads: Array<Enum.UserInputType> = UIS.GetNavigationGamepads();
		if (navGamepads.size() > 0) {
			navGamepads.forEach(function (gamepad, index) {
				if (ActiveGamepad === undefined) {
					ActiveGamepad = gamepad as GamepadType;
				} else if (ActiveGamepad !== undefined && navGamepads[index].Value > ActiveGamepad.Value) {
					ActiveGamepad = gamepad as GamepadType;
				}
			});
		} else {
			const connGamapads: Array<Enum.UserInputType> = UIS.GetConnectedGamepads();
			if (connGamapads.size() > 0) {
				connGamapads.forEach(function (gamepad, index) {
					if (ActiveGamepad === undefined) {
						ActiveGamepad = gamepad as GamepadType;
					} else if (ActiveGamepad !== undefined && connGamapads[index].Value > ActiveGamepad.Value) {
						ActiveGamepad = gamepad as GamepadType;
					}
				});
			}
			if (ActiveGamepad === undefined) {
				ActiveGamepad = Enum.UserInputType.None;
			}
		}
		return ActiveGamepad !== Enum.UserInputType.None ? ActiveGamepad : undefined;
	}
	const gamepadPollMap: PolledGamepadMap = new Map<InputKind, InputObject>();
	let regularKey: InputKind = UIS.GetConnectedGamepads().size() > 0 ? Enum.KeyCode.ButtonR1 : Enum.KeyCode.I;
	/**
	 * Updates the polled inputs for the currently active gamepad controller.
	 *
	 * @param gp The gamepad to get polled {@link InputObject}s from
	 * @internal
	 */
	export function refreshPolledStates(gp: GamepadType) {
		const gpStates = UIS.GetGamepadState(gp as Enum.UserInputType);
		gpStates.forEach(function (state: InputObject) {
			gamepadPollMap.set(state.KeyCode as InputKind, state);
		});
	}
	{
		if (UIS.GamepadEnabled) {
			ActiveGamepad = GetActiveGamepad();
			UIS.GamepadConnected.Connect(function (gamepad: Enum.UserInputType) {
				print(gamepad.Name + " is connected.");
				regularKey = UIS.GetConnectedGamepads().size() > 0 ? Enum.KeyCode.ButtonR1 : Enum.KeyCode.I;
				ActiveGamepad = GetActiveGamepad();
				refreshPolledStates(ActiveGamepad as GamepadType);
			});
			UIS.GamepadDisconnected.Connect(function (gamepad: Enum.UserInputType) {
				print(gamepad.Name + " is disconnected.");
				regularKey = UIS.GetConnectedGamepads().size() > 0 ? Enum.KeyCode.ButtonR1 : Enum.KeyCode.I;
				ActiveGamepad = GetActiveGamepad();
				refreshPolledStates(ActiveGamepad as GamepadType);
			});
			if (UIS.GetConnectedGamepads().size() > 0) {
				CurrentPlatform = "Gamepad";
				refreshPolledStates(ActiveGamepad as GamepadType);
			}
		}
		if (UIS.TouchEnabled) {
			CurrentPlatform = "Touch";
		}
	}
	/**
	 * Refreshes the {@link CurrentPlatform} property.
	 */
	export function RecalibratePlaform() {
		const lastType = UIS.GetLastInputType();
		if (lastType === Enum.UserInputType.Keyboard || lastType.Name.find("Mouse")[0] !== undefined) {
			CurrentPlatform = "Keyboard";
		} else if (lastType === Enum.UserInputType.Touch) {
			CurrentPlatform = "Touch";
		} else if (lastType.Name.find("Gamepad")[0] !== undefined) {
			CurrentPlatform = "Gamepad";
		} else if (UIS.VREnabled) {
			CurrentPlatform = "VR";
		}
	}

	/**
	 * Retrieves the current platform based on the last known input type used.
	 *
	 * @returns The platform to use for input-related tasks.
	 */
	export function GetPlatform(): Platform {
		const lastType = UIS.GetLastInputType();
		if (lastType === Enum.UserInputType.Keyboard || lastType.Name.find("Mouse")[0] !== undefined) {
			return "Keyboard";
		} else if (lastType === Enum.UserInputType.Touch) {
			return "Touch";
		} else if (lastType.Name.find("Gamepad")[0] !== undefined) {
			return "Gamepad";
		} else {
			return "VR";
		}
	}

	/**
	 * Calculates how many platforms are usable.
	 */
	export function EvaluatePlatformCount() {
		DeviceCount = 0;
		DeviceSelectors.forEach(function (f: DeviceSelector) {
			const result = f();
			if (result) {
				DeviceCount++;
			}
		});
	}

	/**
	 * Retrieves the value of {@link ActiveGamepad}
	 * @returns The {@link GamepadType} currently in use.
	 */
	export function GetCurrentGamepad(): GamepadType | undefined {
		return ActiveGamepad;
	}

	/**
	 * Retrieves the appropriate input based on a given {@link InputKind input}.
	 * @param keyCode The input to be checked.
	 * @returns The corresponding input type for the given input
	 */
	export function GetUserInputTypeForKeyCode(keyCode: InputKind): Enum.UserInputType {
		return UIS.GamepadSupports(ActiveGamepad as Enum.UserInputType, keyCode as Enum.KeyCode)
			? (ActiveGamepad as Enum.UserInputType)
			: Enum.UserInputType.Keyboard;
	}

	/**
	 * Determines if the current {@link ActiveGamepad controller} supports the given {@link GamepadButtonCode button}.
	 * @param button The {@link GamepadButtonCode controller button} to check for support with.
	 * @returns Whether or not the given {@link GamepadButtonCode button} is supported.
	 */
	export function ControllerSupports(button: GamepadButtonCode): boolean {
		return UIS.GamepadSupports(ActiveGamepad as Enum.UserInputType, button);
	}

	/**
	 * Retrieves the current state of the given {@link GamepadButtonCode controller input} in realtime (polled).
	 * @param button the {@link GamepadButtonCode button} to query the polled inputs for.
	 * @returns An {@link InputObject} representing the state of the given button.
	 */
	export function GetGamepadState(button: GamepadButtonCode): InputObject | undefined {
		return gamepadPollMap.get(button as InputKind);
	}

	/**
	 * Represents no gamepads (or any other inputs) being present at the moment.
	 */
	export const NONE_INPUT = Enum.UserInputType.None;
	/**
	 * Retrieves the first connected controlled.
	 * @returns The first available {@link GamepadType gamepad} that is connected.
	 */
	export function GetHighestPriorityGamepad(): GamepadType {
		const connectedGamepads = UIS.GetConnectedGamepads();
		let bestGamepad: GamepadType = NONE_INPUT;
		connectedGamepads.sort((a, b) => a.Value < b.Value);
		if (connectedGamepads.size() > 0) {
			bestGamepad = connectedGamepads[0] as GamepadType;
		}
		return bestGamepad;
	}
}

export = InputComponent;
