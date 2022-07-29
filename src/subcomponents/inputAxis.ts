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

	/**
	 * Used to map input types to certain data formats for processing.
	 */
	export type DataFormatMap = Map<Enum.UserInputType, AxisDataFormat>;

	/**
	 * A map of input types and data formats used for processing.
	 */
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

	/**
	 * A function type used for processing rotational values.
	 */
	export type AxisRotationProcessor = (input: InputObject, axis: InputAxis) => void;

	export class InputAxis {
		private time: number | undefined = undefined;
		private last: Vector2 | undefined = undefined;
		private speed = 0;
		private a = 6;
		private maxSpeed = 6;
		private duration = 0.7;
		public UserInputType: Enum.UserInputType;
		public DataFormat: AxisDataFormat;
		public KeyCode: Enum.KeyCode;
		public RotationMode: AxisRotationMode;
		constructor(
			uit = Enum.UserInputType.MouseMovement,
			dataFormat = AxisDataFormat.Position,
			keyCode = Enum.KeyCode.Unknown,
			rotMode = AxisRotationMode.Conventional,
		) {
			this.UserInputType = uit;
			this.DataFormat = dataFormat;
			this.KeyCode = keyCode;
			this.RotationMode = rotMode;
		}
	}
}

export = InputAxisSC;
