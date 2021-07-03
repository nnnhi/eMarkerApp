<template>
  <v-dialog
    v-model="showEditDialog"
    persistent
    max-width="700px"
  >
    <v-card v-if="editedNote">
      <v-card-title>
        <span class="headline">{{ $t("edit_note") }}</span>
      </v-card-title>
      <v-card-text>
        <v-form
          ref="form"
          lazy-validation
        >
          <v-text-field
            v-model="editedNote.definition"
            label="Definition *"
            required
            :rules="[(v) => !!v || 'Definition is required']"
          />

          <v-textarea
            v-model="editedNote.explanation"
            :rules="[(v) => !!v || 'Explanation is required']"
            label="Explanation *"
            rows="2"
            required
          />

          <ckeditor
            v-model="editedNote.example"
            :editor="editor"
            :config="editorConfig"
          />

          <v-checkbox
            v-model="editedNote.hasReminder"
            :label="$t('remind_me_later')"
          />
        </v-form>
        <small>*{{ $t("indicates_required_field") }}</small>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          outlined
          color="secondary"
          text
          @click="close"
        >
          {{ $t("close") }}
        </v-btn>
        <v-btn
          outlined
          color="primary"
          text
          @click="save"
        >
          {{ $t("save") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { NotesService } from "@/services/api.service";
import BalloonEditor from "../plugins/ckeditor";
import { mapActions } from "vuex";

export default {
  name: "EditNoteDialog",
  // eslint-disable-next-line vue/require-prop-types
  props: ["editedNote"],
  data: function () {
    return {
      originalNote : null,
      showEditDialog: false,
      editor: BalloonEditor,
      editorConfig: {
        placeholder: "Give some examples here",
        toolbar: ["bold", "italic", "bulletedList", "numberedList"],
      },
    };
  },
  methods: {
    ...mapActions("alert", ["turnOnSucessAlert", "turnOnErrorAlert"]),
    show() {
      this.showEditDialog = true;
    },
    setOriginalNote(editedNote) {
      this.originalNote = Object.assign({}, editedNote);
    },
    async save() {
      await NotesService.update(this.editedNote.id, this.editedNote);
      this.showEditDialog = false;
      this.turnOnSucessAlert("Save sucessfully!");
    },
    close() {
      this.showEditDialog = false;
      this.editedNote.definition = this.originalNote.definition;
      this.editedNote.explanation = this.originalNote.explanation;
      this.editedNote.example = this.originalNote.example;
      this.editedNote.hasReminder = this.originalNote.hasReminder;
    }
  },
};
</script>