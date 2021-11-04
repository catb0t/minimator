import { Component } from '../base.cmp.js';
import { PageComponent } from '../page.cmp.js';

import { SurfaceComponent, SurfaceMode } from '../surface/surface.cmp.js';
import { ToolbarComponent } from '../toolbar/toolbar.cmp.js';
import { TouchController } from '../../services/touchController/touchController.js';
import { downloader, share } from '../../services/features.js';
import { Shortcut } from '../../services/shortcut/shortcut.js';
import { store } from '../../store.js';

@Component('project-page', './src/components/project/project.style.css')
export class ProjectComponent extends PageComponent {
  
  surface: SurfaceComponent;
  touchHandler: TouchController;
  shortcutBindings: Shortcut;

  constructor(id: number) {
    super('');

    const item = store.getIndex(id);
    const content = store.getItem(id) || '{}';
    const contentData = JSON.parse(content);

    //# Clean dat dirty thing
    document.title = `${item?.title} project`;

    console.log('Project constructor', id, contentData);

    //# Define a type for content data
    const surface = new SurfaceComponent(
      contentData.width, 
      contentData.height, 
      contentData.content
    );
    (window as any).ma = surface; //# Debug purposes
    this.shadowRoot?.appendChild(surface);
    surface.onResize();
    surface.onChange = () => {
      contentData.content = surface.content.innerHTML;
      store.updateItem(id, JSON.stringify(contentData))
    }
    this.surface = surface;

    const touchHandler = new TouchController(surface.el);
    touchHandler.on(surface.eventInput);
    window.addEventListener('resize', surface.onResize);
    this.touchHandler = touchHandler;

    const shortcutBindings = new Shortcut();
    shortcutBindings.on('undo', () => surface.undo());
    shortcutBindings.on('redo', () => surface.redo());
    this.shortcutBindings = shortcutBindings;

    const toolbar = new ToolbarComponent();
    this.shadowRoot?.appendChild(toolbar);
    toolbar.on((eventName, eventData) => {
      let svgOutput;
      switch (eventName) {
        case 'minus':
          toolbar.setThickness(surface.decreaseThickness());
          break;
        case 'plus':
          toolbar.setThickness(surface.increaseThickness());
          break;
        case 'grid':
          surface.toggleGrid();
          break;
        case 'eraser':
          const newMode = eventData ? SurfaceMode.ERASER_MODE : SurfaceMode.PEN_MODE;
          surface.setMode(newMode);
          break;
        case 'share':
          svgOutput = surface.extractSVG();
          share(
            'minimator',
            'https://maxwellito.github.io/minimator',
            svgOutput
          );
          break;
        case 'download':
          svgOutput = surface.extractSVG();
          downloader(svgOutput, 'minimator_demo.svg');
          break;
      }
    });
  }

  exit() {
    window.removeEventListener('resize', this.surface.onResize);
    this.shortcutBindings.destroy();
    this.touchHandler.destroy();
    this.surface.destroy();
    return super.exit();
  }
}
