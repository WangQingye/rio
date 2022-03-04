import {
  createApp
} from 'vue'
import DialogForm from './DialogForm.vue'
import installElementPlus from '../plugins/element'

let instance
const DialogFormCtr = function(config) {
  instance = createApp(DialogForm, {
    ...config
  })
  installElementPlus(instance)
  let node = document.createElement('div')
  let $vm = instance.mount(node)
  document.body.appendChild(node)
  return $vm
}

export default DialogFormCtr