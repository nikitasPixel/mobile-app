import * as Colors from "./colors"
import * as Typo from "./typography"

//Basic image card used in grids 
export const cardContainer = {
    backgroundColor: Colors.white,
    width: "45%",
    minHeight: 229,
    padding: 10,
    margin: 10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 14,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
}

export const cardImg = {
    height: 117,
    width: "100%",
}

export const cardTitle = {
    ...Typo.textMd,
    fontWeight: Typo.semiBold,
    color: Colors.aubergine,
    marginTop: 10
}

//TODO: new promo cards

