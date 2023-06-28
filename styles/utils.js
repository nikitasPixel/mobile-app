import * as Colors from "./colors"
import * as Typo from "./typography"
import * as Shadow from "./shadow"

//Tabs
export const tabBar = {
    width: "70%",
    height: 48,
    margin: 20,
    backgroundColor: Colors.lightGray,
    borderRadius: 40,
    alignSelf: "center"
}

export const tabBarIndicator = {
    backgroundColor: Colors.white,
    borderWidth: 4,
    borderColor: Colors.lightGray,
    borderRadius: 40,
    height: 48,
}

//Container
export const container = {
    backgroundColor: Colors.white,
    width: "100%",
    padding: 10,
    height: "100%"
}

//Accordion
export const accordionContainer = {
    ...Shadow.elevation,
    ...Shadow.shadowProp,
    padding:20,
    backgroundColor:Colors.white,
    display: "flex",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 14,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
}

export const accordionHeader = {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
}

export const accordionHeaderTitle = {
    ...Typo.textLg,
    fontSize:20,
    fontWeight: Typo.semiBold,
    color: Colors.aubergine,
    maxWidth: 250
    
}

export const accordionHeaderIcon = {
    ...Typo.textXl,
    fontWeight: Typo.normal,
    color: Colors.aubergine,
    marginLeft: "auto",
}

export const accordionBody = {
    borderTopWidth:1,
    borderColor:Colors.lightGray,
    paddingTop:15
}

//TODO: alertBox