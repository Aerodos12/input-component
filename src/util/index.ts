import Signal from "@rbxts/signal";
import InputComponent from "..";
import { GamepadDownSignal, InputKind, KeyDownSignal, MouseDownSignal, MouseType } from "../inputTypes";
import PressedHandler from "../pressedState";

namespace InputComponentUtils {
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
}

export = InputComponentUtils;
