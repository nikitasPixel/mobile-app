# MyZeelandia b2b App

Here lies the code of **MyZeelandia** b2b mobile application writen in React Native. 

* **Version**: a.1.*
* **Administration**: [myzeelandia.com] (http://myzeelandia.com)
* **Google Play**: TODO
* **App Store**: TODO

## Dependencies
* Linux Dependencies (use distro's package manager)
    * [Git] (https://git-scm.com)
    * [Node.js] (https://nodejs.org) *-- for npm*
    * Java Development Kit (JDK)
    * [Android Studio] (https://developer.android.com/studio)
    * Android SDK *-- via Android Studio*
* macOS Dependencies (brew)
    * [homebrew] (https://docs.brew.sh)
    * [Git] (https://git-scm.com)
    * [Node.js] (https://nodejs.org) *-- for npm*
    * CocoaPods
    * Xcode & Xcode CLI tools
    * iOS Simulator in Xcode
    * watchman

## Setup
* clone the repo localy: `git clone https://inqa_stamoulohta@bitbucket.org/b2b-customer-app/my_zeelandia_mobile_app.git`
* enter directory: `cd my_zeelandia_mobile_app`
* install dependecies: `npm install`

## Run
* start metro server: `npm run start` *-- in new* terminal
* start emulator
    * android: `npm run android`
    * ios: `npm run ios`
    
## Archive and upload to App Store using Xcode
* In Xcode, select Generic iOS Device as the deployment target.
* Choose Product from the top menu and click on Archive.
* The Xcode Organizer will launch, displaying any archives you've created in the past.
* Make sure the current build is selected and click on Upload to App Store in the right-hand panel.
* Select your credentials and click Choose.
* In the next window that appears, click on Upload in the bottom right-hand corner.
* A success message will appear when the upload has been completed. Click Done.

## Create new release on Google Play Console
* `cd android/app`
* `open build.gradle file and config versionCode and versionName values`
* `run ./gradlew bundleRelease (to generate release)`
* In Google Play Console, click on Internal Testing from Testing menu.
* Click on Create new Release button.
* Upload my_zeelnadia_mobile_app/android/app/build/outputs/bundle/release

## Testing
TODO

## Todo
* Promotions section redesign (call with Denisia: custom price per baker?, define promo types)
* Complex Recipes (BE -> 2 days, FE 2 days)
* Pricing ( 2 days for current products (60))
* HTTPS (1 day)
* Email white list (2 days BE)
* CSS cleanup & UI updates (FE 1.5 day)
* Login email (BE 3 days)
* Launching (5 days)
* Admin Panel copy optimization (1 day)
* Admin Panel restructure benefits (1 day)

* Custom Hooks (fetch, asyncstorage) (low priority, 1 week)
* State management tool (low priority 1 week)
* Transitions
* Regression testing

## Contacts
* George Stamoulis - [stamoulohta] (http://stamoulohta.com) - g.a.stamoulis@gmail.com
* Evangelia Deligianni - [linkedin] (https://linkedin.com/in/evangelia-deligianni-680b811b7) - e.deligianni@inqadigital.com
