<template>
  <div class="uploadFile">
    <div v-if="uploading" class="progress-bar" style="width: 500px;height: 30px; background-color: rgb(76, 85, 85);padding:5px; margin-bottom:20px;">
      <div class="progress-bar" style="height: 100%; background-color: rgb(37, 183, 250);" v-bind:style="{width: percentage + '%'}">
      </div>
    </div>
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
    data() {
      return {
        uploading: false,
        percentage: 0
      }
    },
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
      ...mapMutations('sale',[
        'setFilesForUpload'
      ])
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
