GATO
====

On screen graphic and text overlays for live streaming

Dev setup
---------

* `npm install`
* `npm run watch:server`
* `npm run watch:client`

Packaging
---------

Run `npm run package` to create a Debian package

Usage
-----

Navigate to http://localhost:8080/manage.html in your web browser to get started with GATO.  When running in production, additional configuration is necessary, and the port is 3040.

Your streaming software (e.g. OBS) should be configured with a browser source pointing at http://localhost:8080/viewer.html?display=Overlay on top of any scenes that you wish to overlay banners.  You should create an an extra scene with a browser source pointing at http://localhost:8080/viewer.html?display=Picture%20Box, this can be used for images/slides that you want to broadcast that are not intended to overlay other sources. 

Screenshots
-----------

## Interface to control graphics during a live event

![control-event](https://user-images.githubusercontent.com/2619836/117066212-5d408400-ad20-11eb-9c6e-b5dc602cb056.png)

## Interface to manage events before the live event 
### Editing an event
![edit-event](https://user-images.githubusercontent.com/2619836/117066223-616ca180-ad20-11eb-8201-625dc74edc9a.png)

### Editing a component
![edit-component](https://user-images.githubusercontent.com/2619836/117066220-603b7480-ad20-11eb-9d98-f95d946f67e7.png)

## Interface to configure how components look
![edit-style](https://user-images.githubusercontent.com/2619836/117066228-629dce80-ad20-11eb-9e4d-8f20a6fc2f54.png)

