<template>
  <v-container>
    <v-row
      justify="start"
    >
      <v-col
        v-if="videos.length == 0"
        cols="12"
        class="text-center"
      > 
        {{ $t('no_videos') }}
      </v-col>
      <v-col
        v-for="video in videos"
        v-else
        :key="video.id"
        sm="1"
        md="3"
      >
        <v-hover
          v-slot="{ hover }"
        >
          <v-card
            max-width="300"
            :elevation="hover ? 16 : 2"
            outlined
            class="pa-2 mb-3"
          >
            <router-link
              :to="{ name: 'ViewVideoMarker', params: { id: video.externalVideoID, creatorId: video.myVideo.creatorId }}"
              class="text-decoration-none"
            >
              <v-img
                :src="getThumbnail(video.externalVideoID)"
              />

              <div class="text-title text-truncate py-2">
                {{ video.title }}
              </div>
            </router-link>

            <v-divider />
            <v-card-actions>
              <div class="caption">
                {{ video.myVideo ? video.myVideo.notes.length : 0 }} phrases
              </div>
            </v-card-actions>
            <!-- <v-divider class="mx-4" />

            <v-card-actions>
              <v-btn
                color="primary"
              >
                Review
              </v-btn>
            </v-card-actions> -->
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import {
  VideosService
} from "@/services/api.service";
import { youtubeThumbnail } from "../app.config.js";
import { mapState} from "vuex";

export default {
     name: "MyLearning",
     data: function() {
        return {
            videos: []
        }
     },
computed: {
    ...mapState("user", ["currentUser"]),
  },
      async mounted() {   
        var videoResponse = await VideosService.myVideos();

        this.videos = videoResponse.data ? videoResponse.data : [];
      },
      methods: {
        getThumbnail(externalId) {
          return youtubeThumbnail.replace("{video-id}", externalId)
        }
      }
}
</script>