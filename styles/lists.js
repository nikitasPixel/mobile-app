import * as Colors from "./colors"
import * as Typo from "./typography"

//Visual support single-line list item(used in clients section)
export const singleLineListItem = {
    width: "100%",
    height: 110,
    marginBottom: 25,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 14,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
}

export const singleLineListItemImg = {
    backgroundColor: Colors.brightGray,
    width: 60,
    height: 60,
    marginLeft: 28,
    marginRight: 20,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.lightGray
}

export const singleLineListItemImgText = {
    ...Typo.textLg,
    fontWeight: Typo.normal,
    color: Colors.aubergine,
}

export const singleLineListItemText = {
    ...Typo.textMd,
    fontWeight: Typo.normal,
    color: Colors.aubergine,
    flex: 2
}

//Multi-line list item (used in client details section)
export const multiLineListItem = {
    ...singleLineListItem,
    height: "auto",
    alignItems: "flex-start"
}

export const multiLineListItemTitle = {
    ...Typo.textSm,
    fontWeight: Typo.semiBold,
    color: Colors.aubergine
}

export const multiLineListItemText = {
    ...Typo.textXs,
    fontWeight: Typo.light,
    color: Colors.aubergine
}

//Ordered lists (used in ingredients, steps, benefits sections)
export const orderedListItem = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingVertical:8
}

export const orderedListText = {
    ...Typo.textXs,
    fontWeight: Typo.light,
    textAlign: "left",
    color: Colors.aubergine,
}
export const orderedListIndexDot = {
    width: 16,
    height: 16,
    backgroundColor: Colors.vividYellow,
    borderRadius: 50,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center"
}

export const orderedListIndex = {
    ...Typo.textXxs,
    fontWeight: Typo.normal,
    color: Colors.aubergine
}


