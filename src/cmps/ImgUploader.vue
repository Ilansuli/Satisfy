<template>
  <div className="upload-preview">
    <!-- <img v-if="imgUrl" :src="imgUrl" :style="{ maxWidth: '232px', float: 'right' }" /> -->
    <!-- <label for="imgUpload">{{ uploadMsg }}</label> -->
    <!-- <pre>{{  }}</pre> -->
    
    <input style="cursor:pointer;" type="file" @change="uploadImg" accept="img/*" id="imgUpload" multiple/>
  </div>
</template>

<script>
import { uploadService } from '../services/upload.service'

export default {
  emits: ['updateImgUrl'],
  data() {
    return {
      imgUrl: null,
      height: 232,
      width: 232,
      isUploading: false
    }
  },
  methods: {
    async uploadImg(ev) {
      this.isUploading = true
      const { secure_url, height, width } = await uploadService.uploadImg(ev)
      this.isUploading = false
      this.imgUrl = secure_url
      this.height = height
      this.width = width
      console.log(this.imgUrl);
      this.$emit('updateImgUrl', this.imgUrl)
    }
  },
  computed: {
    uploadMsg() {
      if (this.imgUrl) return 'Upload Another?'
      return this.isUploading ? 'Uploading....' : 'Upload Image'
    }
  }
}
</script>
