import { ActionConfigType } from '../interfaces.ts'
import * as ctrl from "../Ctrl.ts"
import { Action } from '../Action.ts'
import isUndefined from "https://deno.land/x/lodash/isUndefined.js"
import uniq from "https://deno.land/x/lodash/uniq.js"
import union from "https://deno.land/x/lodash/union.js"
import cloneDeep from "https://deno.land/x/lodash/cloneDeep.js"
// import  mixinDeep from "./mixinDeep.js"

export function action<S>(config: ActionConfigType<S> ) {
    return  function <T extends { new(...args: any[]): {} }>(constructor: T) { 
        config.name = isUndefined(config.name) ? constructor.name : config.name !
        // let __cnt__ = 1
        // if ( __cnt__  === 1 ) {
            // return  Ctrl.addAction( config as unknown as Action<any>, 1).then( () => {
                console.log(`Class name: ${config.name} and  Constructor Name: ${constructor.name}}` )
                
                return class extends constructor {   
                    /**
                    * The common Name of both the action and the state data object in the store
                    */
                    name:        string  = isUndefined(config.name) ? constructor.name : config.name !
                    /**
                    * The name of the controller Function to call within the action instance
                    */
                    funcName:    any     = isUndefined(config.ctrl) ? 'ctrl' : config.ctrl as any
                    /**
                    * Class name of action
                    */
                    className:   string  = constructor.name
                    /**
                    * Store id for the state data object within the store
                    */
                    _storeId:    number = -100  // Ctrl.store.getStoreId(action.name)
                    /**
                    * State is the data that the action will eventually publish for other actions to read
                    */
                    state:       S       =  cloneDeep( config.state ) 
                    /**
                     * The list og other object that this action instance and its state depends on
                     */
                    public dependencies:   string[] = []

                    /**
                     * Set dependencies of action
                     * 
                     * @param args An array of name dependencies for this action instance
                     * @return The same list if succesful
                     */
                    setDependencies = (... args: string[] ): string [] => { 
                        this.dependencies = uniq( union( this.dependencies, args ) ) 
                        ctrl.addDependencies( this.name, this.dependencies )
                        return this.dependencies
                    }

                    /**
                     * Get a copy of the state of a named action
                     * 
                     * @param storeName The name of the store object 
                     * @param idx The index of the requested state in the list of immutable stored states, -1 defualt returns the most recently published (current) state
                     * @returns A copy of the state 
                     */
                    getState = (storeName: string, idx: number = -1 ): any => {
                        return ctrl.getState(storeName, idx) as S
                    }

                    /** 
                     * Publish the changed state 
                    */
                    publish = (): void => {
                        let self = this
                        ctrl.publish(this as unknown as Action<any>)
                        .then (() => {
                            self._storeId = ctrl.store.getStoreId(self.className)
                        })
                    }

                    /**
                     * Ping  of action - small test function
                     */
                    ping = () => 'action decorator ping() has been called'
                    //
                    //
                    //
                    // private __cnt__ = 0
                    // private __dummy__ =  async() => { Ctrl.addAction( this as unknown as Action<any>, ++this.__cnt__ ) }
                }
        }
}
