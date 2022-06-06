import Signal from "@rbxts/signal";

const UIS: UserInputService = game.GetService("UserInputService");

namespace InputComponent {
	export type MouseType =
		| Enum.UserInputType.MouseButton1
		| Enum.UserInputType.MouseButton2
		| Enum.UserInputType.MouseButton3;
	export const GamepadButtonChanged: Signal<(button: Enum.KeyCode, isDown: Boolean) => void> = new Signal<
		(button: Enum.KeyCode, isDown: Boolean) => void
	>();
	export const KeyChanged: Signal<(key: Enum.KeyCode, isDown: Boolean) => void> = new Signal<
		(key: Enum.KeyCode, isDown: Boolean) => void
	>();
	export const MouseButtonChanged: Signal<(key: MouseType, isDown: Boolean) => void> = new Signal<
		(key: MouseType, isDown: Boolean) => void
	>();

	export type Platform = "Gamepad" | "Keyboard" | "Touch" | "VR";
	export let CurrentPlatform: Platform = "Keyboard";
	export const PlatformChanged: Signal = new Signal<(platform: Platform) => void>();
	export const DeviceCount: Number = 0;
	export type DeviceSelector = () => Boolean;
	export type DeviceSelectorMap = Map<Platform, DeviceSelector>;
	export const DeviceSelectors: DeviceSelectorMap = new Map<Platform, DeviceSelector>();
	export function AddDeviceSelector(platform: Platform, selector: DeviceSelector) {
		DeviceSelectors.set(platform, selector);
	}
	export type InputKind = Enum.KeyCode | MouseType;
	type PressedState = Map<InputKind, Boolean>;
	class PressedHandler {
		private state: PressedState = new Map<InputKind, Boolean>();
		public setPressed(key: InputKind, isPressed: Boolean) {
			if (key.EnumType === Enum.UserInputType) {
				this.state.set(key, isPressed);
				MouseButtonChanged.Fire(key as MouseType, isPressed);
				return;
			}
			if (UIS.GamepadSupports(Enum.UserInputType.Gamepad1, key as Enum.KeyCode)) {
				GamepadButtonChanged.Fire(key as Enum.KeyCode, isPressed);
			} else {
				KeyChanged.Fire(key as Enum.KeyCode, isPressed);
			}
			this.state.set(key, isPressed);
		}
		public getPressed(key: Enum.KeyCode): Boolean {
			return this.state.get(key) as Boolean;
		}
	}
	export const Pressed: PressedHandler = new PressedHandler();
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
	let ActiveGamepad: GamepadType | undefined = undefined;
	export const CurrentIScheme = "General";
	export interface SensitivityOptions {
		mouse: number;
		aim: number;
		touch: Vector2;
	}
	export const Sensitivity: SensitivityOptions = {
		mouse: 0.3,
		aim: 0.2,
		touch: new Vector2(math.pi * 2.25, math.pi * 2),
	};
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
	export type PolledGamepadMap = Map<InputKind, InputObject>;
	const gamepadPollMap: PolledGamepadMap = new Map<InputKind, InputObject>();
	let regularKey: InputKind = UIS.GetConnectedGamepads().size() > 0 ? Enum.KeyCode.ButtonR1 : Enum.KeyCode.I;
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
}

export = InputComponent;
