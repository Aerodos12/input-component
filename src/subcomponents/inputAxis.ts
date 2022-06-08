namespace InputAxisSC {
	/**
	 * Used to denote how the axis input is processed.
	 */
	export enum AxisDataFormat {
		Position,
		Delta,
		Analog,
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
