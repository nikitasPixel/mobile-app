import * as Colors from "./colors"
import * as Typo from "./typography"

export const inputLabel = {
    ...Typo.textXxs,
    fontWeight: Typo.normal,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: Colors.aubergine,
    paddingBottom: 8
}

export const textInputIconContainer = {
    marginLeft: "auto",
    alignSelf: "center"
}

export const textInput = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: 300,
    backgroundColor: Colors.white,
    textAlign: "left",
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.lightPurple,
    borderRadius: 24,
    color: Colors.aubergine,
}

export const textInputIcon = {
    color: Colors.royalPurple,
    fontSize: 16
}

export const hintMsg = {
    ...Typo.textXs,
    fontWeight: Typo.normal,
    color: "#B7B4C8",
    letterSpacing: 1,
    textTransform: "uppercase",
    paddingVertical: 5
}

export const errorMsg = {
    ...hintMsg,
    color: "#FF0439"
}