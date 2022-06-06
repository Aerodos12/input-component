import Signsl from "@rbxts/signal"

const UIS: UserInputService = game.GetService("UserInputService");

namespace InputComponent {
	export type MouseType = (Enum.UserInputType.MouseButton1 | Enum.UserInputType.MouseButton2 | Enum.UserInputType.MouseButton3);
	export const GamepadButtonChanged: Signsl<(button: Enum.KeyCode, isDown: Boolean) => void> = new Signsl<(button: Enum.KeyCode, isDown: Boolean) => void>();
	export const KeyChanged: Signsl<(key: Enum.KeyCode, isDown: Boolean) => void> = new Signsl<(key: Enum.KeyCode, isDown: Boolean) => void>();
	export const MouseButtonChanged: Signsl<(key: MouseType, isDown: Boolean) => void> = new Signsl<(key: MouseType, isDown: Boolean) => void>();

	export type Platform = "Gamepad" | "Keyboard" | "Touch" | "VR";
	export const PlatformChanged: Signsl = new Signsl<(platform: Platform) => void>();
	export let DeviceCount: Number = 0;
	export type DeviceSelector = () => Boolean;
	export type DeviceSelectorMap = Map<Platform, DeviceSelector>;
	export const DeviceSelectors: DeviceSelectorMap = new Map<Platform, DeviceSelector>();
	export function AddDeviceSelector(platform: Platform, selector: DeviceSelector){
		DeviceSelectors.set(platform, selector);
	}
	export type InputKind = (Enum.KeyCode | MouseType);
	type PressedState = Map<InputKind, Boolean>;
	class PressedHandler {
		private state: PressedState = new Map<InputKind, Boolean>();
		public setPressed(key: InputKind, isPressed: Boolean){
			if (key.EnumType === Enum.UserInputType) {
				this.state.set(key, isPressed);
				MouseButtonChanged.Fire(key as MouseType, isPressed);
				return;
			}
			if(UIS.GamepadSupports(Enum.UserInputType.Gamepad1, key as Enum.KeyCode)){
				GamepadButtonChanged.Fire(key as Enum.KeyCode, isPressed)
			}	else {
				KeyChanged.Fire(key as Enum.KeyCode, isPressed);
			}
			this.state.set(key, isPressed);
		}
		public getPressed(key: Enum.KeyCode) : Boolean {
			return this.state.get(key) as Boolean;
		}
	}
	export const Pressed: PressedHandler = new PressedHandler();
	{
		Enum.KeyCode.GetEnumItems().forEach(function(keyCode: Enum.KeyCode){
			Pressed.setPressed(keyCode as InputKind, false);
		})
	}
	{
		Enum.UserInputType.GetEnumItems().forEach(function(mouseButton: Enum.UserInputType){
			const mouseType = mouseButton as MouseType;
			if (mouseType === undefined){
				return;
			}
			if(!(mouseType.Name.find("MouseButton")[0])){
				return;
			}
			Pressed.setPressed(mouseType as InputKind, false);
		})
	}
	export type GamepadType = (Enum.UserInputType.Gamepad1 | Enum.UserInputType.Gamepad2 | Enum.UserInputType.Gamepad3 | Enum.UserInputType.Gamepad4 | Enum.UserInputType.Gamepad5 | Enum.UserInputType.Gamepad6 | Enum.UserInputType.Gamepad7 | Enum.UserInputType.Gamepad8 | Enum.UserInputType.None);
	let ActiveGamepad: (GamepadType | undefined) = undefined;
	export let CurrentIScheme: string = "General";
	export interface SensitivityOptions {
		mouse: number;
		aim: number;
		touch: Vector2;
	};
	export let Sensitivity: SensitivityOptions = {
		mouse: 0.3,
		aim: 0.2,
		touch: new Vector2(math.pi * 2.25, math.pi * 2)
	};
	export function GetActiveGamepad() : (GamepadType | undefined) {
		let activateGamepad: (GamepadType | undefined) = undefined;
		let navigationGamepads: Array<GamepadType> = new Array<GamepadType>();
		let navGamepads: Array<Enum.UserInputType> = UIS.GetNavigationGamepads();
		if (navGamepads.size() > 0) {
			navGamepads.forEach(function(gamepad, index){
				if (ActiveGamepad === undefined){
					ActiveGamepad = gamepad as GamepadType;
				} else if ((ActiveGamepad !== undefined) && navGamepads[index].Value > ActiveGamepad.Value){
					ActiveGamepad = gamepad as GamepadType;
				}
			});	

		} else {
			let connGamapads: Array<Enum.UserInputType> = UIS.GetConnectedGamepads();
			if (connGamapads.size() > 0) {
				connGamapads.forEach(function(gamepad, index){
					if (ActiveGamepad === undefined){
						ActiveGamepad = gamepad as GamepadType;
					} else if ((ActiveGamepad !== undefined) && connGamapads[index].Value > ActiveGamepad.Value){
						ActiveGamepad = gamepad as GamepadType;
					}
				});	
			}
			if (ActiveGamepad === undefined){
				ActiveGamepad = Enum.UserInputType.None;
			}
		}
		return (ActiveGamepad !== Enum.UserInputType.None) ? ActiveGamepad : undefined;
	}
	
}

export = InputComponent