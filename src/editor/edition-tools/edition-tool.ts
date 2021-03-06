import { GUI } from 'dat-gui';

import Edition from '../gui/edition';
import Editor from '../editor';
import { IStringDictionary } from '../typings/typings';

export interface IEditionTool<T> {
    editor?: Editor;

    divId: string;
    tabName: string;

    object: T;
    tool: Edition;
    state: IStringDictionary<ToolState>;

    update (object: T): void;
    clear (): void;
    resize (width: number, height: number): void;
    isSupported (object: any): boolean;
    onModified? (): void;
}

export interface ToolState {
    closed: boolean;
    children: IStringDictionary<ToolState>
}

export default abstract class AbstractEditionTool<T> implements IEditionTool<T> {
    /**
     * The editor reference. Set by the inspector component.
     */
    public editor: Editor = null;

    /**
     * The object being edited.
     */
    public object: T = null;
    /**
     * The dat-gui tool reference.
     */
    public tool: Edition = null;

    /**
     * The current state of the dat-gui tool.
     */
    public state: IStringDictionary<ToolState> = null;
    /**
     * The search element used to filter folders/inputs.
     */
    public search: HTMLInputElement = null;

    /**
     * The div id of the tool. Must be provided by the tool.
     */
    public abstract divId: string;
    /**
     * The name of the tab to display. Must be provided by the tool.
     */
    public abstract tabName: string;

    /**
     * Constructor
     */
    constructor ()
    { }

    /**
     * Updates the edition tool
     * @param object: the object to edit
     */
    public update (object: T): void {
        this.object = object;

        // Add search
        if (this.search)
            this.search.remove();

        this.search = document.createElement('input');
        this.search.style.width = '100%';
        this.search.style.height = '20px';
        this.search.style.borderRadius = '45px';
        this.search.style.marginTop = '10px';
        this.search.style.marginBottom = '10px';
        this.search.classList.add('editorSearch');
        this.search.placeholder = 'Search...';
        $('#' + this.divId).prepend(this.search);
        this.search.addEventListener('keyup', (ev) => this.tool.filter(this.search.value));

        // Reset edition element
        let lastScroll = 0;

        if (this.tool) {
            lastScroll = this.tool.element.domElement.scrollTop;
            this.state = this._saveState();
            this.tool.remove();
        }

        this.tool = new Edition();
        this.tool.build(this.divId);
        this.tool.element['onResize']();

        setTimeout(() => {
            this.tool.element.domElement.scrollTop = lastScroll;
            this._restoreState();
        }, 0);
    }

    /**
     * Called once the user selects a new object in
     * the scene of the graph
     */
    public clear (): void
    { }

    /**
     * Called once the editor has been resized.
     * @param width the width in pixels of the panel.
     * @param height the height in pixels of the panel.
     */
    public resize (width: number, height: number): void
    { }

    /**
     * Sets the name of the tool's tab
     * @param name the new name of the tab
     */
    protected setTabName (name: string): void {
        const tab = <any> this.editor.inspector.tabs.get(this.divId);
        tab.caption = name;

        this.editor.inspector.tabs.refresh();
    }

    /**
     * Returns if the object is supported by the edition tool
     * @param object: the object to test
     */
    public abstract isSupported (object: any): boolean;

    // Saves the state of the 
    private _saveState (root: GUI = this.tool.element): IStringDictionary<ToolState> {
        const state = { };

        for (const key in root.__folders) {
            const f = root.__folders[key];
            state[key] = {
                closed: f.closed,
                children: this._saveState(f)
            };
        }

        return state;
    }

    // Restores the state
    private _restoreState (root: GUI = this.tool.element, rootState: IStringDictionary<ToolState> = this.state): void {
        for (const key in rootState) {
            const f = root.__folders[key];
            if (!f)
                continue;

            const value = rootState[key];
            value.closed ? f.close() : f.open();

            this._restoreState(f, value.children);
        }
    }
}
