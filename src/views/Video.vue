<template>
  <v-container>
    <v-row
      v-if="!$route.params.id"
      justify="center"
      no-gutters
    >
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="youtubeUrl"
          solo
          :label="$t('input_your_youtube_URL_to_start_learning_it')"
          prepend-inner-icon="mdi-movie-search-outline"
          :rules="rules.youtubeUrl"
        />
      </v-col>
    </v-row>
    <v-row v-if="$route.params.id && !video.id">
      <v-col
        cols="12"
        class="text-center"
      >
        {{ $t("video_not_found") }}
      </v-col>
    </v-row>
    <v-row
      v-else-if="video.externalVideoID"
      justify="center"
    >
      <v-col
        cols="12"
        md="8"
      >
        <v-layout
          d-flex
          flex-column
        >
          <youtube
            ref="youtube"
            :video-id="youtubeVideoId"
            width="100%"
            @playing="playing"
            @paused="paused"
          />
          <div class="d-flex justify-space-between">
            <div class="title">
              {{ video.title }}
            </div>
            <div v-if="['create', 'edit'].includes(mode)">
              <v-btn
                v-if="myVideo && myVideo.visibility == 0"
                icon
                color="primary"
                @click="privacyDialog = true"
              >
                <v-icon>mdi-lock</v-icon>
              </v-btn>
              <v-btn
                v-else
                icon
                color="primary"
                @click="privacyDialog = true"
              >
                <v-icon>mdi-account-group</v-icon>
              </v-btn>
            </div>
          </div>
          <v-btn
            v-if="['create', 'edit'].includes(mode)"
            :disabled="!video.externalVideoID"
            rounded
            color="primary"
            class="mt-4 mx-auto align-self-baseline"
            @click="pauseAndAddNewPhrase()"
          >
            {{ playerStatus == 1 ? "pause and open note" : "open note" }}
          </v-btn>
        </v-layout>
      </v-col>
      <v-col
        cols="12"
        md="4"
      >
        <v-card
          class="mx-auto"
          min-height="500"
        >
          <v-toolbar
            color="grey"
            dark
          >
            <v-toolbar-title>{{ $t("notes") }}</v-toolbar-title>

            <v-spacer />
            <v-btn
              v-if="['create', 'edit'].includes(mode)"
              :disabled="!selectedNote"
              icon
              @click="showDialog('delete', index)"
            >
              <v-icon color="red">
                mdi-delete
              </v-icon>
            </v-btn>

            <v-btn
              v-if="['create', 'edit'].includes(mode)"
              :disabled="!selectedNote"
              icon
              @click="showDialog('edit')"
            >
              <v-icon>mdi-circle-edit-outline</v-icon>
            </v-btn>
            <!-- <v-btn
              v-if="myVideo"
              icon
              @click="setAllReminders()"
            >
              <v-icon v-if="getTotalReminder == 0">
                mdi-checkbox-blank-circle-outline
              </v-icon>
              <v-icon v-else-if="getTotalReminder == myVideo.notes.length">
                mdi-checkbox-marked-circle-outline
              </v-icon>
              <v-icon v-else>
                mdi-minus-circle-outline
              </v-icon>
            </v-btn> -->
          </v-toolbar>
          <v-list
            v-if="myVideo"
            two-line
            max-height="500"
            class="overflow-y-auto"
          >
            <v-list-item-group
              v-model="selected"
              active-class="blue--text"
            >
              <template v-for="(item, index) in myVideo.notes">
                <v-list-item
                  :key="index"
                  @click="select(item)"
                >
                  <template>
                    <v-list-item-content>
                      <v-list-item-title v-text="item.definition" />

                      <v-list-item-subtitle
                        class="text--primary"
                        v-text="item.explanation"
                      />
                    </v-list-item-content>

                    <v-list-item-action>
                      <v-list-item-action-text
                        v-text="convertTimestampToTime(item.startAt)"
                      />

                      <!-- <v-checkbox
                        v-model="item.hasReminder"
                        color="yellow darken-3"
                      /> -->

                      <v-icon
                        v-if="item.hasReminder"
                        color="primary"
                      >
                        mdi-autorenew
                      </v-icon>
                    </v-list-item-action>
                  </template>
                </v-list-item>

                <v-divider
                  v-if="index < myVideo.notes.length - 1"
                  :key="index"
                />
              </template>
            </v-list-item-group>
          </v-list>
          <v-card-text
            v-else
            class="text-center"
          >
            {{ $t("no_notes_for_this_video") }}
          </v-card-text>
          <v-expand-transition>
            <v-card
              v-if="isAddingNewPhrase"
              class="transition-fast-in-fast-out v-card--reveal fill-height"
              :loading="false"
            >
              <template slot="progress">
                <v-progress-linear
                  color="deep-purple"
                  height="10"
                  indeterminate
                />
              </template>

              <v-card-title>{{ $t("new_note") }}</v-card-title>
              <v-card-subtitle class="pb-0">
                at {{ convertTimestampToTime(newPhrase.startAt) }}
              </v-card-subtitle>
              <v-card-text
                class="overflow-y-auto"
                style="min-height: 380px; max-height: 380px"
              >
                <v-form
                  ref="form"
                  lazy-validation
                >
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="newPhrase.definition"
                        :label="$t('definition')"
                        required
                        :rules="[(v) => !!v || 'Definition is required']"
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-textarea
                        v-model="newPhrase.explanation"
                        class="ma-0 pa-0"
                        :rules="[(v) => !!v || 'Explanation is required']"
                        :label="$t('explanation')"
                        rows="2"
                        required
                      />
                    </v-col>

                    <v-col cols="12">
                      <ckeditor
                        v-model="newPhrase.example"
                        :editor="editor"
                        :config="editorConfig"
                      />
                    </v-col>

                    <v-col cols="12">
                      <v-checkbox
                        v-model="newPhrase.hasReminder"
                        class="ma-0"
                        :label="$t('remind_me_later')"
                      />
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>

              <v-card-actions class="justify-center pb-3">
                <v-btn
                  color="error"
                  @click="isAddingNewPhrase = false"
                >
                  {{ $t("cancel") }}
                </v-btn>
                <v-btn
                  :disabled="!valid"
                  class="mr-4"
                  color="primary"
                  @click="validate"
                >
                  {{ $t("create") }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-expand-transition>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog
      v-model="privacyDialog"
      width="350"
    >
      <v-card>
        <v-card-title class="headline grey lighten-2">
          {{ $t("select_audience") }}
        </v-card-title>
        <v-card-text>
          <v-radio-group
            v-model="myVideo.visibility"
            column
            @change="savePrivacy()"
          >
            <v-radio :label="$t('only_me')" />
            <v-radio :label="$t('anyone')" />
          </v-radio-group>
        </v-card-text>
      </v-card>
    </v-dialog>
    <EditNoteDialog
      ref="editDialog"
      :edited-note="selectedNote"
    />

    <DeleteNoteConfirmDialog
      ref="deleteDialog"
      :deleted-note="selectedNote"
      @success="onDeleteSuccess"
    />
  </v-container>
</template>

<script>
import {
  VideosService,
  UserVideosService,
  NotesService,
} from "@/services/api.service";
import { getIdFromUrl } from "vue-youtube";
import BalloonEditor from "../plugins/ckeditor";
import { mapState, mapActions } from "vuex";
import EditNoteDialog from "../components/EditNoteDialog";
import DeleteNoteConfirmDialog from "../components/DeleteNoteConfirmDialog";

export default {
  name: "Video",
  components: {
    EditNoteDialog,
    DeleteNoteConfirmDialog,
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ["creatorId"],
  data: function () {
    return {
      youtubeUrlPattern:
        /^(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch|v|embed)(?:\.php)?(?:\?.*v=|\/))([a-zA-Z0-9\\_-]+)$/,
      isAddingNewPhrase: false,
      mode: "view",
      playerStatus: Number,
      selected: -1,
      setting: {},
      video: {},
      myVideo: {},
      newPhrase: {},
      valid: true,
      youtubeUrl: "",
      youtubeVideoId: "",
      rules: {
        youtubeUrl: [
          (val) =>
            !val || this.youtubeUrlPattern.test(val) || `The URL is invalid`,
        ],
      },
      editor: BalloonEditor,
      editorConfig: {
        placeholder: "Give some examples here",
        toolbar: ["bold", "italic", "bulletedList", "numberedList"],
      },
      privacyDialog: false,
      selectedNote: null,
    };
  },
  computed: {
    ...mapState("user", ["currentUser"]),
    player() {
      return this.$refs.youtube.player;
    },
    getTotalReminder() {
      return this.myVideo && this.myVideo.notes
        ? this.myVideo.notes.filter((p) => p.hasReminder).length
        : 0;
    },
  },
  watch: {
    async youtubeUrl(val) {
      try {
        if (this.youtubeUrlPattern.test(val)) {
          this.youtubeVideoId = getIdFromUrl(val);
        }
      } catch (error) {
        this.turnOnErrorAlert(error.message);
      }
    },
    async youtubeVideoId(val) {
      var videoResponse = await VideosService.query({
        externalVideoId: val,
        creatorId: this.creatorId,
      });

      if (this.$route.params.id) {
        if (!videoResponse.data || videoResponse.data.length == 0) return;
        Object.assign(this.video, videoResponse.data[0]);
        this.myVideo = videoResponse.data[0].myVideo
          ? videoResponse.data[0].myVideo
          : {};
        if (this.currentUser) {
          this.mode =
            this.myVideo &&
            this.myVideo.creatorId == this.currentUser.profile.sub
              ? "edit"
              : "view";
        }
      } else {
        this.mode = "create";
        this.myVideo = {
          visibility: 1,
          languageISOCode: "en"
        };
        if (videoResponse.data && videoResponse.data.length > 0) {
          this.video = videoResponse.data[0];
          this.myVideo.videoId = this.video.id;
        } else {
          var youtubeResponse = await VideosService.getYoutubeVideo({
            id: this.youtubeVideoId,
          });
          this.video = {
            externalVideoID: this.youtubeVideoId,
            title: youtubeResponse.data.items[0].snippet.title,
            channelTitle: youtubeResponse.data.items[0].snippet.channelTitle,
            channelID: youtubeResponse.data.items[0].snippet.channelId,
          };
        }
      }
    },
    $route(to) {
      if (to.params.id) {
        this.youtubeVideoId = this.$route.params.id;
      }
      this.resetNewPhrase();
    },
  },
  async created() {
    if (this.$route.params.id) {
      this.youtubeVideoId = this.$route.params.id;
    }
    this.resetNewPhrase();
  },
  methods: {
    ...mapActions("alert", ["turnOnErrorAlert"]),
    async playing() {
      this.playerStatus = await this.player.getPlayerState();
    },
    async paused() {
      this.playerStatus = await this.player.getPlayerState();
    },
    playVideo() {
      this.player.playVideo();
    },
    async pauseAndAddNewPhrase() {
      this.player.pauseVideo();
      this.openNoteForm();
    },
    async openNoteForm() {
      this.newPhrase.startAt = await this.player.getCurrentTime();
      this.newPhrase.languageISOCode = this.myVideo.languageISOCode;
      this.isAddingNewPhrase = true;
    },
    convertTimestampToTime(timestamp) {
      if (!timestamp) timestamp = 0;
      // 2
      var hours = Math.floor(timestamp / 60 / 60);

      // 37
      var minutes = Math.floor(timestamp / 60) - hours * 60;

      // 42
      var seconds = Math.floor(timestamp % 60);

      var formatted =
        hours.toString().padStart(2, "0") +
        ":" +
        minutes.toString().padStart(2, "0") +
        ":" +
        seconds.toString().padStart(2, "0");

      return formatted;
    },
    resetNewPhrase() {
      this.isAddingNewPhrase = false;
      this.newPhrase = {
        explanation: "",
        definition: "",
        example: "",
        languageISOCode: "en",
        startAt: 0,
        hasReminder: true,
      };
    },
    validate() {
      if (!this.$refs.form.validate()) return;
      if (!this.video.id) {
        this.saveVideo();
        return;
      }

      if (!this.myVideo.id) {
        this.saveUserVideo();
        return;
      }

      this.saveNote();
    },
    select(note) {
      this.selectedNote = note;
      this.seekTo(note.startAt);
    },
    showDialog(action) {
      if (!this.selectedNote) return;
      if (action == "edit") {
        this.$refs.editDialog.show();
      } else {
        this.$refs.deleteDialog.show();
      }
    },
    onDeleteSuccess() {
      const index = this.notes.indexOf(this.editedNote);
      if (index > -1) {
        this.notes.splice(index, 1);
      }
      this.turnOnSucessAlert("Delete sucessfully!");
    },
    seekTo(seconds) {
      this.player.seekTo(seconds, true);
    },
    savePrivacy() {
      if (this.myVideo.id) {
        this.updateUserVideo();
      } else {
        this.privacyDialog = false;
      }
    },
    saveVideo() {
      var savedUserVideo = Object.assign({}, this.myVideo);
      savedUserVideo.note = this.newPhrase;
      var savedVideo = Object.assign({ userNote: savedUserVideo }, this.video);

      VideosService.create(savedVideo)
        .then((response) => {
          if (response && response.data) {
            this.video.id = response.data.videoId;
            Object.assign(this.myVideo, {
              id: response.data.userVideoId,
              notes: [this.newPhrase],
            });
          }

          this.resetNewPhrase();
        })
        .catch((error) => {
          this.turnOnErrorAlert(error.message);
        });
    },
    saveUserVideo() {
      var savedUserVideo = Object.assign({}, this.myVideo);
      savedUserVideo.note = this.newPhrase;
      UserVideosService.create(this.myVideo)
        .then((response) => {
          // eslint-disable-next-line no-debugger
          debugger
          this.myVideo.id = response.data;
          this.myVideo.notes = [this.newPhrase];
          this.resetNewPhrase();
        })
        .catch((error) => {
          this.turnOnErrorAlert(error.message);
        });
    },
    updateUserVideo() {
      UserVideosService.update(this.myVideo.id, this.myVideo)
        .then(() => {
          this.privacyDialog = false;
        })
        .catch((error) => {
          this.turnOnErrorAlert(error.message);
        });
    },
    saveNote() {
      var savedNote = Object.assign(
        { sourceId: this.myVideo.id },
        this.newPhrase
      );
      NotesService.create(savedNote)
        .then((response) => {
          savedNote.id = response.data.id;
          this.myVideo.notes.push(savedNote);
          this.resetNewPhrase();
        })
        .catch((error) => {
          this.turnOnErrorAlert(error.message);
        });
    },
    setAllReminders() {
      if (!this.myVideo) return;
      if (
        this.getTotalReminder == 0 ||
        this.getTotalReminder != this.myVideo.notes.length
      ) {
        this.myVideo.notes.forEach((p) => (p.hasReminder = true));
      } else {
        this.myVideo.notes.forEach((p) => (p.hasReminder = false));
      }
    },
  },
};
</script>
<style scoped>
.v-card--reveal {
  bottom: 0;
  opacity: 1 !important;
  position: absolute;
  width: 100%;
}
.ck.ck-editor__editable_inline {
  border-bottom-style: solid;
  border-bottom-color: rgba(0, 0, 0, 0.42);
  border-bottom-width: thin 0 0 0;
}
</style>
