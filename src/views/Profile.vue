<template>
  <v-container />
</template>

<script>
// import {
//   DashboardService
// } from "@/services/api.service";
import { mapActions, mapState } from "vuex";

export default {
  name: "Profile",
  data: function () {
    return {};
  },
  computed: {
    ...mapState("user", ["currentUser"]),
  },
  async created() {},
  methods: {
    ...mapActions("alert", ["turnOnErrorAlert"]),
  }
};
</script>
