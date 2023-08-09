
import {staticImgsCollection} from '@/includes/firebase'

export default {
  formatTime(time) {
    const minutes = Math.floor(time / 60) || 0
    const secounds = Math.floor(time - minutes * 60) || 0

    return `${minutes}:${secounds < 10 ? '0' : ''}${secounds}`
  },
  formatDate(date) {
    const splitDate = date.split(' ')

    return `${splitDate[1]} ${splitDate[2]} ${splitDate[3]}  -  ${splitDate[4]}`;
  },
  async getStaticImage(name){
    const snapshots = await staticImgsCollection.where('name', '==', name).get()
    let img = []

    snapshots.forEach((document) => {
      img.push({
        ...document.data()
      })
    })

    return img[0].url
  }

}
