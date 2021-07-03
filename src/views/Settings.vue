<template>
  <v-container>
    <v-card>
      <v-toolbar
        flat
        color="primary"
        dark
      >
        <v-toolbar-title>{{ $t('settings') }}</v-toolbar-title>
        <v-spacer />

        <v-btn
          icon
          @click="saveSetting()"
        >
          <v-icon>mdi-content-save</v-icon>
        </v-btn>
      </v-toolbar>
      <v-tabs v-model="tab">
        <v-tab>
          <v-icon left>
            mdi-account
          </v-icon>
          Profile
        </v-tab>
        <!-- <v-tab>
          <v-icon left>
            mdi-chart-line-variant
          </v-icon>
          Learning
        </v-tab> -->
        <v-tab>
          <v-icon left>
            mdi-cogs
          </v-icon>
          System
        </v-tab>
        <v-tab-item v-if="currentUser">
          <v-container class="px-5">
            <v-row>
              <!-- <v-col
                cols="12"
                sm="4"
                md="3"
                class="text-center"
              >
                <v-card>
                  <v-img
                    height="225px"
                    :src="profile.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'"
                  />

                  <v-card-actions class="justify-center">
                    <v-btn
                      color="primary"
                      class="ma-2 white--text"
                      @click="triggerUploader"
                    >
                      Upload
                      <v-icon
                        right
                        dark
                      >
                        mdi-cloud-upload
                      </v-icon>
                    </v-btn>
                    <input
                      ref="fileInput"
                      class="d-none"
                      type="file"
                      accept="image/*"
                      @change="filesChange"
                    >
                  </v-card-actions>
                </v-card>
                
                <div class="d-flex-row text-center">
                  <div class="overline mt-2">
                    {{ learningProfile.numberOfFollowers }}
                    Followers
                  </div>
                  <div class="overline"> 
                    {{ learningProfile.numberOfFollowings }}
                    Followings
                  </div>
                </div>
              </v-col> -->
              <v-col
                cols="12"
                sm="6"
                md="4"
              >
                <v-text-field
                  v-model="currentUser.profile.email"
                  disabled
                  label="Email"
                />
                <v-text-field
                  v-model="profile.displayName"
                  label="Display name"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-tab-item>
        <!-- <v-tab-item>
          <v-row>
            <v-col
              cols="12"
              sm="4"
              md="3"
            >
              <v-card
                flat
                class="px-5"
              >
                <v-text-field
                  v-model="setting.maxReviewCardPerDay"
                  type="number"
                  hint="Maximum number of notes to review each day"
                  label="Review limit"
                />
              </v-card>
            </v-col>
          </v-row>
        </v-tab-item> -->
        <v-tab-item>
          <v-row>
            <v-col
              cols="12"
              sm="4"
              md="3"
            >
              <v-card
                flat
                class="px-5"
              >
                <v-select
                  v-model="setting.displayLanguage"
                  :items="displayLanguages"
                  item-text="englishName"
                  item-value="twoLetterISOLanguageName"
                  label="Display Language"
                />
              </v-card>
            </v-col>
          </v-row>
        </v-tab-item>
      </v-tabs>
    </v-card>
  </v-container>
</template>
<script>
import i18n from "@/plugins/i18n";

import { SettingsService, ProfileService, MetaService } from "@/services/api.service";
import { mapActions, mapState } from "vuex";

export default {
  name: "Settings",
  data: function () {
    return {
      setting: {
        maxReviewCardPerDay: 0,
        displayLanguage: "en",
      },
      displayLanguages: [],
      tab: null,
      profile :
      {
        displayName : "",
        avatar :  null
      }

      // learningProfile : {
      //   numberOfFollowers : 0,
      //   numberOfFollowings : 0
      // }
    };
  },
  computed: {
    ...mapState("user", ["currentUser"]),
  },
  async mounted() {
    var settingResponse = await SettingsService.getSettingsOfCurrentUser();
    if (settingResponse.data) {
      this.setting = settingResponse.data;
    }

    var metaResponse = await MetaService.getLearningLanguages();
    this.displayLanguages = metaResponse.data;
    this.profile.displayName = this.currentUser.profile.name;
  },
  methods: {
    ...mapActions("user",["setName"]),
    triggerUploader() {
      this.$refs.fileInput.click()
    },
    filesChange(event) {
      if (!event.target.files.length) return;
      this.profile.avatar = URL.createObjectURL(event.target.files[0]);
    },
    saveSetting() {
      if (this.tab == 0) {
        ProfileService.update({username : this.profile.displayName})
        .then(() => {
            this.setName(this.profile.displayName);
          })
          .catch((error) => {
            alert(error);
          });
      } else {
      if (this.setting.id) {
        SettingsService.update(this.setting.id, this.setting)
          .then(() => {
            i18n.locale = this.setting.displayLanguage;
          })
          .catch((error) => {
            alert(error);
          });
      } else {
        SettingsService.create(this.setting)
          .then(() => {
              i18n.locale = this.setting.displayLanguage;
          })
          .catch((error) => {
            alert(error);
          });
      }
      }
    },
  },
};
</script>
<style scoped>
.v-card {
  transition: opacity .4s ease-in-out;
}

.v-card.on-hover {
  opacity: 0.6;
 }
</style>