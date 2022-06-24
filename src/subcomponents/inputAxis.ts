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
		Custom,
		Conventional,
	}
}

export = InputAxisSC;
