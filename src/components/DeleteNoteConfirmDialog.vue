<template>
  <v-dialog
    v-model="showDeleteDialog"
    persistent
    max-width="290"
  >
    <v-card>
      <v-card-title class="headline">
        {{ $t('confirmation') }}
      </v-card-title>
      <v-card-text>{{ $t('are_you_sure_to_delete_the_note') }}</v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          outlined
          color="secondary"
          text
          @click="showDeleteDialog = false"
        >
          {{ $t('cancel') }}
        </v-btn>
        <v-btn
          outlined
          color="primary"
          text
          @click="deleteNote()"
        >
          {{ $t('yes') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { NotesService } from "@/services/api.service";

export default {
  name: "DeleteNoteConfirmDialog",
  // eslint-disable-next-line vue/require-prop-types
  props: ["deletedNote"],
  data: function () {
    return {
      showDeleteDialog: false,
    };
  },
  methods: {
    show() {
      this.showDeleteDialog = true;
    },
    async deleteNote() {
        await NotesService.delete(this.deletedNote.id);
        this.$emit("success");
        this.showDeleteDialog = false;
    }
  },
};
</script>