<template>
  <v-container>
    <v-row justify="center">
      <v-col
        cols="12"
        md="4"
      >
        <v-autocomplete
          v-model="selectedChannels"
          :loading="isLoadingChannel"
          :items="channels"
          :search-input.sync="channelSearched"
          item-text="title"
          item-value="id"
          label="Search by channels"
          multiple
          clearable
          small-chips
          dense
          deletable-chips
          outlined
          hide-details
          allow-overflow
        />
      </v-col>
      <v-col
        cols="12"
        md="5"
      >
        <v-text-field
          v-model="searchValue"
          outlined
          clearable
          hide-details
          dense
          label="Search by title"   
          @click:clear="cleanTitle"
        />
      </v-col>
      <v-col
        cols="12"
        md="1"
      >
        <v-btn
          block
          color="primary"
          @click="search"
        >
          <v-icon left>
            mdi-magnify
          </v-icon>
          Search
        </v-btn>
      </v-col>
    </v-row>
    <v-row
      v-if="videos.length == 0"
      justify="center"
    >
      {{ $t("no_videos") }}
    </v-row>
    <v-row
      v-else
      justify="start"
    >
      <v-col
        v-for="video in videos"
        :key="video.id"
        cols="12"
        sm="4"
      >
        <v-hover v-slot="{ hover }">
          <v-card
            :elevation="hover ? 16 : 2"
            outlined
            class="pa-1 fill-height"
          >
            <v-img
              min-height="200"
              :src="getThumbnail(video.externalVideoID)"
            />

            <div class="text-title text-truncate py-2">
              {{ video.title }}
            </div>
            <v-sheet
              v-for="(userVideo, index) in video.userVideos"
              :key="index"
              outlined
              rounded
              class="mb-2"
            >
              <v-hover v-slot="{ hover }">
                <v-row  
                  no-gutters
                  class="py-1 pl-2"
                  :class="{ 'grey lighten-3': hover }"
                >
                  <v-col
                    cols="10"
                    class="caption align-self-center"
                  >
                    <v-chip
                      color="primary mr-1 mr-sm-2"
                      outlined
                      small
                      label
                    >
                      {{ userVideo.learners.length }} {{ $t("learners") }}
                    </v-chip>
                    <v-chip
                      color="primary"
                      outlined
                      small
                      label
                    >
                      {{ userVideo.numberOfNotes }} {{ $t("notes") }}
                    </v-chip>
                    <div class="text--secondary">
                      {{ $t("created_by") }} {{ userVideo.createdBy }}
                    </div>
                  </v-col>
                  <v-col
                    cols="2"
                    class="text-right"
                  >
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          class="mx-2"
                          icon
                          v-bind="attrs"
                          small
                          v-on="on"
                          @click="goToVideoDetail(video.externalVideoID, userVideo.creatorId)"
                        >
                          <v-icon>
                            mdi-play-circle-outline
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>Watch</span>
                    </v-tooltip>
                    <v-tooltip
                      v-if="!userVideo.isLearning"
                      bottom
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                    
                          class="mx-2"
                          icon
                          v-bind="attrs"
                          small
                          v-on="on"
                          @click="learn(video.id, userVideo.id)"
                        >
                          <v-icon dark>
                            mdi-plus
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>Add to my learning</span>
                    </v-tooltip>
                  </v-col>
                </v-row>
              </v-hover>
            </v-sheet>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
    <v-row
      v-if="paging.hasNextPage"
      justify="center"
    >
      <v-col
        cols="12"
        md="6"
      >
        <v-btn
          block
          @click="loadMore()"
        >
          {{ $t("load_more") }}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import {
  VideosService,
  UserVideosService,
  ChannelsService,
} from "@/services/api.service";
import { mapState, mapActions } from "vuex";

import { youtubeThumbnail } from "../app.config.js";
export default {
  name: "Home",
  data: function () {
    return {
      videos: [],
      paging: {
        hasNextPage: false,
        totalItemCount: 0,
        pageNumber : 1,
        pageSize : 20
      },
      searchValue: "",
      isLoadingChannel: false,
      channels: [],
      selectedChannels: [],
      channelSearched: null,
    };
  },
  computed: {
    ...mapState("user", ["currentUser"]),
  },
  async mounted() {
    this.search();
    this.isLoadingChannel = true;
    try {
      var channelResponse = await ChannelsService.query();
      this.channels = channelResponse.data ? channelResponse.data : [];
      this.isLoadingChannel = false;
    } catch (error) {
      this.isLoadingChannel = false;
    }
  },
  methods: {
    ...mapActions(["turnOnLoading", "turnOffLoading"]),
    ...mapActions("alert",["turnOnErrorAlert"]),
    ...mapActions("user", ["login"]),

    getThumbnail(externalId) {
      return youtubeThumbnail.replace("{video-id}", externalId);
    },
    async learn(videoId, userVideoId) {
      if (!this.currentUser) {
        this.login();
        return;
      }

      await UserVideosService.learn(userVideoId);
      var video = this.videos.find(x=>x.id == videoId);
      if (video) {
        var userVideo = video.userVideos.find(u=>u.id == userVideoId);
        userVideo.isLearning = true;
      }
    },
    async loadMore() {
      this.paging.pageNumber++;
      var newData = await this.fetch();
      this.videos = this.videos.concat(newData);
    },
    async search() {
      this.paging.pageNumber = 1;
      this.videos = await this.fetch();
    },
     async cleanTitle() {
      this.searchValue = "";
      this.search();
    },
    async fetch() {
      this.turnOnLoading();

      try {
        var videoResponse = await VideosService.search({
          title: this.searchValue,
          channelIds: this.selectedChannels,
          pageNumber: this.paging.pageNumber,
          pageSize: this.paging.pageSize
        });
        if (videoResponse.data) {
          this.paging.hasNextPage = videoResponse.data.hasNextPage;
          this.paging.totalItemCount = videoResponse.data.totalItemCount;
          this.paging.pageNumber = videoResponse.data.pageNumber;
          this.paging.pageSize = videoResponse.data.pageSize;

          if (this.currentUser) {
            videoResponse.data.items.forEach((v) => {
              v.userVideos.forEach((uv) => {
                uv.isLearning =
                  uv.learners.find((l) => {
                    return l.learnerId === this.currentUser.profile.sub;
                  }) !== undefined;
              });
            });
          }
        }

        this.turnOffLoading();
        return videoResponse.data ? videoResponse.data.items : [];
      } catch (error) {
        this.turnOffLoading();
        this.turnOnErrorAlert(error.message);
        return [];
      }
    },
    goToVideoDetail(externalVideoID, creatorId) {
      this.$router.push({
          name: "ViewVideoMarker",
          params: {
            id: externalVideoID,
            creatorId: creatorId,
          },
        });
    },
  },
};
</script>