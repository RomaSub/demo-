import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  getFamilyMembers: () => ipcRenderer.invoke('getFamilyMembers'),
  createFamilyMember: (familyMember) => ipcRenderer.invoke('getFamilyMembers', familyMember),
  updateFamilyMember: (familyMember) => ipcRenderer.invoke('getFamilyMembers', familyMember),
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
