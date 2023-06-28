import * as Colors from "./colors"
import * as Typo from "./typography"

export const primary = {
	paddingHorizontal: 48,
	paddingVertical: 11,
	backgroundColor: Colors.vividYellow,
	borderRadius: 43,
	alignSelf: "center",
};

export const yellowPlus = {
	backgroundColor:Colors.vividYellow,
	alignItems:"center",
	width: 33,
	height: 33,
	borderRadius: 37,
};

export const disabled = {
	...primary,
	backgroundColor: Colors.lightGray,
};

export const primaryText = {
	...Typo.textMd,
	fontWeight: Typo.semiBold,
	color: Colors.aubergine,
}

export const disabledText = {
	...primaryText,
	color: Colors.gray,
};

//TODO: plus minus buttons


