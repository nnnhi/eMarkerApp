<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      absolute
      top
      temporary
      app
    >
      <v-list
        nav
        dense
        shaped
      >
        <v-subheader>
          <router-link
            to="/"
            class="d-flex align-center text-decoration-none"
          >
            <v-img
              alt="Vuetify Logo"
              class="shrink mr-2"
              contain
              src="./assets/logo.png"
              transition="scale-transition"
              width="40"
            />

            <div class="text-h6">
              eMarker
            </div>
          </router-link>
        </v-subheader>
        <v-list-item-group
          v-model="navGroup"
          color="primary"
        >
          <v-list-item>
            <v-icon class="mr-2">
              mdi-home
            </v-icon>
            <v-list-item-content>
              <v-list-item-title v-text="'Home'" />
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-icon class="mr-2">
              mdi-view-dashboard
            </v-icon>
            <v-list-item-content>
              <v-list-item-title v-text="'Dashboard'" />
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app>
      <v-app-bar-nav-icon
        v-if="currentUser"
        class="d-block d-md-none"
        @click="drawer = true"
      />

      <router-link
        to="/"
        class="d-flex align-center text-decoration-none"
      >
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="./assets/logo.png"
          transition="scale-transition"
          width="40"
        />

        <div class="text-md-h5">
          eMarker
        </div>
      </router-link>

      <v-spacer />
      <div
        
        class="d-none d-md-block"
      >
        <router-link
          to="/"
          tag="span"
        >
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                x-large
                icon
                v-bind="attrs"
                :color="$route.name == 'Home' ? 'primary' : ''"
                v-on="on"
              >
                <v-icon>mdi-home</v-icon>
              </v-btn>
            </template>
            <span>Home</span>
          </v-tooltip>
        </router-link>
        <router-link
          v-if="isVerifiedEmail"
          to="/dashboard"
          tag="span"
        >
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                x-large
                icon
                v-bind="attrs"
                :color="$route.name == 'Dashboard' ? 'primary' : ''"
                v-on="on"
              >
                <v-icon>mdi-view-dashboard</v-icon>
              </v-btn>
            </template>
            <span>Dashboard</span>
          </v-tooltip>
        </router-link>
      </div>
      <v-spacer />

      <v-btn
        v-if="!currentUser"
        text
        @click="login"
      >
        <span>{{ $t("login") }}</span>
        <v-icon>mdi-login</v-icon>
      </v-btn>

      <div
        v-else
        class="mr-3"
      >
        <!-- <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn 
              v-bind="attrs"
              icon
              @click="changeLocale('fr')"
              v-on="on"
            >
              <v-badge
                color="red"
                dot
              >
                <v-icon>mdi-bell-ring-outline</v-icon>
              </v-badge>
            </v-btn>
          </template>
          <span>Notifications</span>
        </v-tooltip> -->

        <v-tooltip
          v-if="isVerifiedEmail"
          bottom
        >
          <template v-slot:activator="{ on, attrs }">
            <router-link
              to="/videos/create"
              tag="span"
            >
              <v-btn
                v-bind="attrs"
                icon
                v-on="on"
              >
                <v-icon class="mx-md-1">
                  mdi-plus-circle-outline
                </v-icon>
              </v-btn>
            </router-link>
          </template>
          <span> {{ $t("create") }} </span>
        </v-tooltip>

        <!-- <v-menu
          :close-on-content-click="false"
          :nudge-width="100"
          offset-y
        >
          <template v-slot:activator="{ on, attrs }">
            <v-icon
            class="mx-1"
              v-bind="attrs"
              v-on="on"
            >
              mdi-plus-circle-outline
            </v-icon>
          </template>

          <v-card>
            <v-list
              nav
              dense
            >
              <v-list-item-group
                color="primary"
              >
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-video-stabilization</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>Add your video</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card>
        </v-menu> -->
        <v-avatar
          v-if="currentUser.profile.avatar"
          color="blue"
          class="ml-md-3"
        >
          <img alt="Avatar">
        </v-avatar>
        <v-avatar
          v-else
          color="primary"
        >
          <v-icon dark>
            mdi-account-circle
          </v-icon>
        </v-avatar>
        <v-menu
          offset-y
        >
          <template v-slot:activator="{ attrs, on }">
            <v-btn icon>
              <v-icon
                v-bind="attrs"
                v-on="on"
              >
                mdi-arrow-down-drop-circle-outline
              </v-icon>
            </v-btn>
          </template>
          <v-list shaped>
            <v-list-item>
              <!-- <v-list-item-avatar>
                <img
                  :src="$auth.user.picture"
                  alt="Your picture"
                >
              </v-list-item-avatar> -->

              <v-list-item-content>
                <v-list-item-title>
                  {{ currentUser.profile.name }}
                </v-list-item-title>
                <v-list-item-subtitle>{{ currentUser.profile.email }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider />
            <router-link
              v-if="isVerifiedEmail"
              to="/myLearning"
              class="text-decoration-none"
            >
              <v-list-item link>
                <v-list-item-icon>
                  <v-icon>mdi-video-stabilization</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>{{ $t("my_videos") }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </router-link>
            <router-link
              v-if="isVerifiedEmail"
              to="/settings"
              class="text-decoration-none"
            >
              <v-list-item link>
                <v-list-item-icon>
                  <v-icon>mdi-cog</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>{{ $t("settings") }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </router-link>
            <v-list-item link>
              <v-list-item-icon>
                <v-icon>mdi-logout</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title @click="logout">
                  {{ $t("logout") }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <transition
          name="fade"
          mode="out-in"
        >
          <router-view />
        </transition>
        <v-alert
          class="app-alert text-truncate"
          :value="alert.show"
          dense
          :type="alert.type"
          transition="scroll-x-reverse-transition"
        >
          {{ alert.message }}
        </v-alert>
        <v-dialog
          v-model="loading"
          persistent
          width="300"
        >
          <v-card
            color="primary"
            dark
          >
            <v-card-text>
              {{ $t("loading") }}
              <v-progress-linear
                indeterminate
                color="white"
                class="mb-0"
              />
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-container>
    </v-main>
    <v-footer app>
      <!-- -->
    </v-footer>
  </v-app>
</template>

<script>
import i18n from "@/plugins/i18n";
import { SettingsService } from "@/services/api.service";
import { mapActions, mapState, mapGetters } from "vuex";

export default {
  name: "App",
  data: function () {
    return {
      accessTokenExpired: false,
      isLoggedIn: false,
      menuItems: [
        { text: "My videos", icon: "mdi-video-stabilization" },
        { text: "Settings", icon: "mdi-cog" },
        { text: "Logout", icon: "mdi-logout" },
      ],
      isShowAlert: true,
      drawer: false,
      navGroup: null,
    };
  },
  computed: {
    ...mapState("alert", ["alert"]),
    ...mapState(["loading"]),
    ...mapState("user", ["currentUser"]),
    ...mapGetters("user", ['isVerifiedEmail'])
  },
  watch: {
    navGroup() {
      this.drawer = false;
    },
  },
  async mounted() {
    if (this.currentUser && !this.currentUser.expired) {
      var settingResponse = await SettingsService.getSettingsOfCurrentUser();
      if (settingResponse.data) {
        i18n.locale = settingResponse.data.displayLanguage;
      }
    }
  },
  methods: {
    ...mapActions("user", ["login", "logout"]),
  },
};
</script>
<style>
.v-application .ck-content p {
  margin-bottom: 5px !important;
}
.v-item-group a {
  text-decoration: none;
}
.v-alert.app-alert {
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 1000;
}

.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.3s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
