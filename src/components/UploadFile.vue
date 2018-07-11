<template>
  <div class="uploadFile">
    <input type="file" value="upload" id="fileButton" multiple="multiple" v-on:change="getFiles" />
  </div>
</template>

<script>
  import {
    mapActions,
    mapMutations,
    mapState,
    mapGetters
  } from 'vuex'

  export default {
    name: 'uploadFile',
    methods: {
      getFiles(e) {
        //Get files
        if (e.target.files.length <= 5) {
          var filesForUpload = [];
          for (var i = 0; i < e.target.files.length; i++) {
            var imageFile = e.target.files[i]
            filesForUpload.push(imageFile)
          }
          this.setFilesForUpload(filesForUpload)
        } else {
          alert('You can only upload up to five files!')
        }
      },
      ...mapMutations('sale', [
        'setFilesForUpload'
      ]),
    }
  }

</script>

<style scoped>
  .uploadFile {
    min-height: 150px;
    width: 100%;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }

</style>
