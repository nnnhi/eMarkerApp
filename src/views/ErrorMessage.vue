<template>
  <v-container>
    <div
      v-if="!loading && !currentUser.profile.email_verified"
      class="text-center"
    >
      <span v-if="errorType == 'VerifyEmail'">
        {{ $t("verify_email_message") }}
      </span>
    </div>
  </v-container>
</template>
<script>
//import { ProfileService } from "@/services/api.service";
import { mapActions, mapState } from "vuex";

export default {
  name: "ErrorMessage",
  // eslint-disable-next-line vue/require-prop-types
  props: ["errorType"],
  data: function () {
    return {
      show : false
    };
  },
  computed: {
    ...mapState("user", ["currentUser", "loading"])
  },
  watch: {
    async loading() {
      if (this.currentUser.profile.email_verified) {
        this.$router.push({ name: 'Home'});
      }
    }
  },
  async mounted() {
    // var profileResponse = await ProfileService.get();

    // if (profileResponse.data.emailConfirmed) {
    //   this.setEmailConfirmed(profileResponse.data.emailConfirmed);
    //   this.$router.push({ name: 'Home'})
    // } else {
    //   this.show = true;
    // }
  },
  methods: {
    ...mapActions("user", ["setEmailConfirmed"]),
  }
};
</script>