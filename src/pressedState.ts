import { GamepadDownSignal, InputKind, KeyDownSignal, MouseDownSignal, MouseType, PressedState } from "./inputTypes";

const UIS = game.GetService("UserInputService");
/**
 * Class/object used for handling a {@link PressedState}.
 */
export default class PressedHandler {
	/**
	 * Updates the "pressed" state of the given {@link InputKind input}.
	 * @param key the given input.
	 * @param isPressed whether or not the {@link key given input} is held down.
	 * @returns nothing.
	 */
	public setPressed(key: InputKind, isPressed: boolean): void {
		if (key.EnumType === Enum.UserInputType) {
			this.state.set(key, isPressed);
			this.mouseButtonChanged.Fire(key as MouseType, isPressed);
			return;
		}
		// eslint-disable-next-line roblox-ts/lua-truthiness
		if (UIS.GamepadSupports(Enum.UserInputType.Gamepad1, key as Enum.KeyCode)) {
			this.gamepadButtonChanged.Fire(key as Enum.KeyCode, isPressed);
		} else {
			this.keyChanged.Fire(key as Enum.KeyCode, isPressed);
		}
		this.state.set(key, isPressed);
	}
	/**
	 * Retrieves the current state of the given key, mouse button or gamepad button.
	 * @param key the given {@link Enum.KeyCode keycode} to check for a press with.
	 * @returns Whether or not the given input was pressed.
	 */
	public getPressed(key: InputKind): boolean {
		return this.state.get(key) as boolean;
	}
	/**
	 * Creates a cache of "pressed" input states.
	 * @param gamepadButtonChanged the {@link GamepadDownSignal} event used for gamepad input events.
	 * @param mouseButtonChanged the {@link MouseDownSignal} event used for mouse button events.
	 * @param keyChanged the {@link KeyChanged} event used for key press events.
	 * @param state An optional {@link Map map} of pressed and unpressed input states.
	 */
	constructor(
		private gamepadButtonChanged: GamepadDownSignal,
		private mouseButtonChanged: MouseDownSignal,
		private keyChanged: KeyDownSignal,
		private state: PressedState = new Map<InputKind, boolean>(),
	) {}
}
