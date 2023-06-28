import { Platform, NativeModules } from "react-native"
import Env from "../context/Env"

const locale =
    (Platform.OS === "ios"
        ? NativeModules.SettingsManager.settings.AppleLocale || NativeModules.SettingsManager.settings.AppleLanguages[0]
        : NativeModules.I18nManager.localeIdentifier
    ).substr(0, 2)

    console.log(Env.DEFAULT_LOCALE, locale);


export default data => !data || data[locale] || data[Env.DEFAULT_LOCALE] || data