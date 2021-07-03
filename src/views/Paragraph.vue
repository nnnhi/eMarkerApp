<template>
  <v-container>
    <v-stepper
      v-model="activeNoteIndex"
      vertical
    >
      <v-stepper-step
        editable
        :complete="activeNoteIndex > 1"
        step="1"
      >
        Define paragraph
        <small>Enter your paragraph and highlight words</small>
      </v-stepper-step>

      <v-stepper-content step="1">
        <ckeditor
          :editor="editor"
          :config="editorConfig"
        />
        <v-btn
          class="mt-3"
          color="primary"
          @click="activeNoteIndex = 2"
        >
          Continue
        </v-btn>
      </v-stepper-content>

      <v-stepper-step
        :complete="activeNoteIndex > 2"
        step="2"
      >
        Define notes
      </v-stepper-step>

      <v-stepper-content step="2">
        <v-sheet
          class="mx-auto"
        >
          <v-slide-group
            v-model="model"
            class="pa-3"
            center-active
            show-arrows
          >
            <v-slide-item
              v-for="n in 10"
              :key="n"
              v-slot="{ active, toggle }"
            >
              <v-card
                v-if="active"
                color="yellow lighten-3"
                class="fill-height ma-3"
                width="300"
              >
                <h3 class="text-center mt-2">
                  New Note
                </h3>
                <v-card-text
                  class="overflow-y-auto"
                  style="min-height:280px;max-height:280px"
                >
                  <template>
                    <v-textarea
                      v-model="newPhrase.explanation"
                      :rules="[v => !!v || 'Explanation is required']"
                      label="Explanation"
                      rows="2"
                      outlined
                      required
                    />

                    <ckeditor
                      v-model="newPhrase.example"
                      :editor="editor"
                      :config="noteEditorConfig"
                    />

                    <!-- <v-select
                    v-model="newPhrase.tags"
                    :items="items"
                    label="Tags"
                  ></v-select> -->

                    <v-checkbox
                      v-model="newPhrase.hasReminder"
                      label="Remind me later"
                    />
                  </template>
                </v-card-text>

                <v-card-actions
                  v-if="false"
                  class="justify-center"
                >
                  <v-btn
                    :disabled="!valid"
                    class="mr-4"
                    color="primary"
                    @click="validate"
                  >
                    Save
                  </v-btn>

                  <v-btn
                    color="error"
                  >
                    Cancel
                  </v-btn>
                </v-card-actions>
              </v-card>
              <v-card
                v-else
                class="fill-height ma-3"
                height="280"
                width="300"
                color="grey lighten-1"
                @click="toggle"
              >
                <v-row
                  class="fill-height"
                  align="center"
                  justify="center"
                >
                  <v-scale-transition>
                    <h4 class="white--text">
                      Sample
                    </h4>
                  </v-scale-transition>
                </v-row>
              </v-card>
            </v-slide-item>
          </v-slide-group>
        </v-sheet>
        <v-btn
          color="primary"
          @click="activeNoteIndex = 3"
        >
          Continue
        </v-btn>
        <v-btn text>
          Cancel
        </v-btn>
      </v-stepper-content>

      <v-stepper-step
        :complete="activeNoteIndex > 3"
        step="3"
      >
        {{ $t('review') }}
      </v-stepper-step>

      <v-stepper-content step="3">
        <v-card
          color="grey lighten-1"
          class="mb-12"
          height="200px"
        />
        <v-btn
          color="primary"
        >
          {{ $t('save') }}
        </v-btn>
      </v-stepper-content>
    </v-stepper>
  </v-container>
</template>
<script>
import Ckeditor from "../plugins/ckeditor";
export default {
  name: "Paragraph",
  data: function() {
    return {
        activeNoteIndex:1,
        newPhrase : {},
    editor: Ckeditor,
      editorConfig: {
        placeholder: 'Input your content here',
      },
      noteEditorConfig: {
        toolbar: [ 'bold', 'italic', 'bulletedList', 'numberedList' ],
        placeholder: 'Give your example here',
      }
    }
  }
}
</script>