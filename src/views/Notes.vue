<template>
  <v-container>
    <v-row
      v-if="notes"
      justify="start"
    >
      <v-col
        v-if="notes.length == 0"
        cols="12"
        class="text-center"
      > 
        {{ $t('no_notes') }}
      </v-col>
      <v-col
        v-for="(note, index) in notes"
        v-else
        :key="note.id"
        cols="12"
        sm="2"
        md="4"
      >
        <v-hover
          v-slot="{ hover }"
        >
          <v-card   
            :elevation="hover ? 14 : 2"
            class="fill-height"
          >
            <v-system-bar
              v-if="currentUser.profile.sub == note.creatorId"
              color="yellow lighten-3"
            >
              <v-spacer />

              <v-icon
                color="info"
                @click="show('edit', index)"
              >
                mdi-square-edit-outline
              </v-icon>
              <v-icon
                color="error"
                @click="show('delete', index)"
              >
                mdi-delete
              </v-icon>
            </v-system-bar>
            <v-card
              :max-height="currentUser.profile.sub == note.creatorId ? 200 : 224"

              class="overflow-y-auto fill-height"
              color="yellow lighten-3"
            >
              <v-card-text>
                <p class="display-1 text--primary">
                  {{ note.definition }}
                </p>
                <p>
                  {{ note.explanation }}
                </p>
                <div
                  v-if="note.example"
                  class="text--primary"
                  v-html="note.example"
                />
              </v-card-text>
            </v-card>
            
          <!-- <v-card-actions class="justify-center">
            <v-btn
              class="px-5"
              rounded
              color="primary"
              to="/review"
            >
              Review
            </v-btn>
          </v-card-actions> -->
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
    <EditNoteDialog
      ref="editDialog"
      :edited-note="editedNote"
    />
                
    <DeleteNoteConfirmDialog 
      ref="deleteDialog"
      :deleted-note="editedNote" 
      @success="onDeleteSuccess"
    />
  </v-container>
</template>
<script>
import {
  NotesService
} from "@/services/api.service";
import BalloonEditor from "../plugins/ckeditor";
import {mapActions, mapState} from "vuex";
import EditNoteDialog from "../components/EditNoteDialog";
import DeleteNoteConfirmDialog from "../components/DeleteNoteConfirmDialog";

export default {
     name: "Notes",
    components: {
      EditNoteDialog, 
      DeleteNoteConfirmDialog
      },
     data: function() {
        return {
            notes: null,
            showEditDialog:false,
            showDeleteDialog:false,
            editedNote: null,
            editor: BalloonEditor,
            editorConfig: {
              placeholder: "Give some examples here",
              toolbar: ["bold", "italic", "bulletedList", "numberedList"],
            }
        }
     },
     computed: {
           ...mapState("user", ["currentUser"])
     },
      async created() {   
        var notesResponse = await NotesService.getMyNotes();

        this.notes = notesResponse.data ? notesResponse.data : [];
          
      },
      methods: {
        ...mapActions("alert", ["turnOnSucessAlert", "turnOnErrorAlert"]),
        onDeleteSuccess() {
            const index = this.notes.indexOf(this.editedNote);
            if (index > -1) {
              this.notes.splice(index, 1);
            }
            this.turnOnSucessAlert("Delete sucessfully!");
        },
        show(action, index) {
          this.editedNote = this.notes[index];
          if (action == "edit") {
            this.$refs.editDialog.setOriginalNote(this.editedNote);
            this.$refs.editDialog.show();
          } else {
            this.$refs.deleteDialog.show();
          }
        }
      }
}
</script>

