import {Loop, ControlsModule} from 'whs';

import {VREffect} from './lib/VREffect';
import {VRControls as VRControlsNative} from './lib/VRControls';
import {WEBVR} from './lib/WebVR';

export class VRModule {
  constructor(params = {}) {
    this.params = Object.assign(params, {
      message: true,
      button: true
    });

    this.scene = null;
    this.camera = null;
  }

  manager(manager) {
    const rendering = manager.use('rendering');
    const renderer = manager.get('renderer');

    const resize = manager.use('resize');

    const effect = new VREffect(renderer);

    this.scene = manager.get('scene');
    this.camera = manager.get('camera');

    rendering.effect(effect);

    // TODO: Fix resize.

    console.log(effect);

    resize.addCallback((width, height) => {
      effect.setSize(+width, +height);
    });

    // WEBVR
    const {message, button} = this.params;

    if (message) WEBVR.checkAvailability().catch(message => {
			document.body.appendChild(WEBVR.getMessageContainer(message));
		});

    if (button) WEBVR.getVRDisplay(display => {
      document.body.appendChild(WEBVR.getButton(display, renderer.domElement));
    });
  }
}

export class VRControls extends ControlsModule {
  constructor({object, onError, intensity}) {
    const controls = new VRControlsNative(object.native, onError);

    controls.standing = true;
    controls.scale = intensity;

    super({controls});
  }
}