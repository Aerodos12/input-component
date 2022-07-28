namespace InputAxisSC {
	/**
	 * Used to denote how the axis input is processed.
	 */
	export enum AxisDataFormat {
		/**
		 * Generic axis data format.
		 */
		Position,
		/**
		 * Generic mouse delta axis format.
		 */
		Delta,
		/**
		 * Used with inputs such as keyboard keys.
		 */
		Analog,
		/**
		 * Used for rotating things (such as the camera).
		 */
		Rotation,
	}

	/**
	 * Used for rotary inputs.
	 */
	export enum AxisRotationMode {
		/**
		 * Handle rotary values with your own way (function)
		 */
		Custom,
		/**
		 * Handle rotary inputs the usual way (Rodblogan Warfare style)
		 */
		Conventional,
	}

	export type DataFormatMap = Map<Enum.UserInputType, AxisDataFormat>;

	export const DATA_FORMATS: DataFormatMap = new Map<Enum.UserInputType, AxisDataFormat>();

	{
		DATA_FORMATS.set(Enum.UserInputType.MouseMovement, AxisDataFormat.Position);
		DATA_FORMATS.set(Enum.UserInputType.MouseWheel, AxisDataFormat.Position);
		DATA_FORMATS.set(Enum.UserInputType.Gamepad1, AxisDataFormat.Position);
		DATA_FORMATS.set(Enum.UserInputType.Gamepad2, AxisDataFormat.Position);
		DATA_FORMATS.set(Enum.UserInputType.Gamepad3, AxisDataFormat.Position);
		DATA_FORMATS.set(Enum.UserInputType.Gamepad4, AxisDataFormat.Position);
		DATA_FORMATS.set(Enum.UserInputType.Gamepad5, AxisDataFormat.Position);
		DATA_FORMATS.set(Enum.UserInputType.Gamepad6, AxisDataFormat.Position);
		DATA_FORMATS.set(Enum.UserInputType.Gamepad7, AxisDataFormat.Position);
		DATA_FORMATS.set(Enum.UserInputType.Gamepad8, AxisDataFormat.Position);
		DATA_FORMATS.set(Enum.UserInputType.Keyboard, AxisDataFormat.Analog);
		DATA_FORMATS.set(Enum.UserInputType.MouseButton1, AxisDataFormat.Analog);
		DATA_FORMATS.set(Enum.UserInputType.MouseButton2, AxisDataFormat.Analog);
		DATA_FORMATS.set(Enum.UserInputType.MouseButton3, AxisDataFormat.Analog);
	}
}

export = InputAxisSC;
