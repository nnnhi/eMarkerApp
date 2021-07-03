<template>
  <v-container>
    <v-row justify="center">
      <v-col
        cols="12"
        sm="6"
        md="4"
      >
        <v-hover v-slot="{ hover }">
          <v-card
            :elevation="hover ? 14 : 2"
            class="deep-purple darken-2"
          >
            <router-link
              to="/notes"
              class="
                d-flex
                flex-no-wrap
                justify-space-between
                text-decoration-none
              "
            >
              <v-icon
                large
                class="ma-3"
                color="white"
              >
                mdi-card-text-outline
              </v-icon>
              <div class="mx-auto">
                <v-card-title class="justify-center white--text">
                  {{ summary.numberOfNotes }}
                </v-card-title>
                <v-card-subtitle class="white--text text-uppercase">
                  {{ $t("total_notes") }}
                </v-card-subtitle>
              </div>
            </router-link>
          </v-card>
        </v-hover>
      </v-col>
      <!-- <v-col
        cols="12"
        sm="6"
        md="4"
      >
        <v-hover
          v-slot="{ hover }"
        >
          <v-card
            :elevation="hover ? 14 : 2"
            class="green darken-2"
          >
            <div class="d-flex flex-no-wrap justify-space-between">
              <v-icon
                large
                class="ma-3"
                color="white"
              >
                mdi-clipboard-text-outline
              </v-icon>
              <div class="mx-auto">
                <v-card-title class="justify-center white--text">
                  {{ summary.numberOfPhragraphs }}
                </v-card-title>
                <v-card-subtitle class="white--text">
                  TOTAL PARAGRAPHS
                </v-card-subtitle>
              </div>
            </div>
          </v-card>
        </v-hover>
      </v-col> -->

      <v-col
        cols="12"
        sm="6"
        md="4"
      >
        <v-hover v-slot="{ hover }">
          <v-card
            :elevation="hover ? 14 : 2"
            class="red darken-2"
          >
            <router-link
              to="/myLearning"
              class="
                d-flex
                flex-no-wrap
                justify-space-between
                text-decoration-none
              "
            >
              <v-icon
                large
                class="ma-3"
                color="white"
              >
                mdi-youtube
              </v-icon>
              <div class="mx-auto">
                <v-card-title class="justify-center white--text">
                  {{ summary.numberOfVideos }}
                </v-card-title>
                <v-card-subtitle class="white--text text-uppercase">
                  {{ $t("total_videos") }}
                </v-card-subtitle>
              </div>
            </router-link>
          </v-card>
        </v-hover>
      </v-col>
      <v-col
        cols="12"
        sm="6"
      >
        <v-card
          class="text-center"
          color="yellow lighten-3"
        >
          <v-card-title>
            {{ $t("reviewing_your_notes") }}
          </v-card-title>
          <v-divider class="mx-4" />

          <v-card-text class="text-h4">
            {{ summary.numberOfReviewedNotes }} {{ $t("notes") }}
          </v-card-text>
          <v-card-actions class="justify-center">
            <v-btn
              v-if="summary.numberOfReviewedNotes > 0"
              class="px-5"
              rounded
              outlined
              color="primary"
              to="/review"
            >
              {{ $t("review") }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col class="d-none">
        <v-card
          max-width="600"
          class="mx-auto"
        >
          <v-toolbar
            color="light-blue"
            dark
          >
            <v-icon large>
              mdi-calendar-check-outline
            </v-icon>

            <v-toolbar-title class="ml-5">
              To do
            </v-toolbar-title>

            <v-spacer />

            <v-btn icon>
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
          </v-toolbar>

          <v-list
            subheader
            two-line
          >
            <v-subheader inset>
              Today
            </v-subheader>

            <v-list-item
              v-for="file in tasks"
              :key="file.title"
            >
              <v-list-item-avatar>
                <v-icon
                  :class="file.color"
                  dark
                  v-text="file.icon"
                />
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title v-text="file.title" />

                <v-list-item-subtitle v-text="file.subtitle" />
              </v-list-item-content>

              <v-list-item-action>
                <v-btn icon>
                  <v-icon color="grey lighten-1">
                    mdi-information
                  </v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
            <v-divider inset />

            <v-subheader inset>
              Incomming
            </v-subheader>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { DashboardService } from "@/services/api.service";
import { mapActions, mapState } from "vuex";

export default {
  name: "Dashboard",
  data: function () {
    return {
      summary: {
        numberOfReviewedNotes: 0,
        numberOfVideos: 0,
        numberOfPhragraphs: 0,
        numberOfNotes: 0,
      },
      tasks: [
        {
          color: "blue",
          icon: "mdi-clipboard-text",
          subtitle: "Jan 20, 2014",
          title: "Vacation itinerary",
        },
        {
          color: "amber",
          icon: "mdi-gesture-tap-button",
          subtitle: "Jan 10, 2014",
          title: "Kitchen remodel",
        },
      ],
    };
  },
  computed: {
    ...mapState("user", ["currentUser"]),
  },
  async created() {
    if (this.currentUser) {
      var dashboardResponse = await DashboardService.query().catch((error) => {
        this.turnOnErrorAlert(error.message);
      });
      this.summary = dashboardResponse.data;
    }
  },
  methods: {
    ...mapActions("alert", ["turnOnErrorAlert"]),
  },
};
</script>
