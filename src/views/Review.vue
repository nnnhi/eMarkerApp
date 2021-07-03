<template>
  <v-container>
    <v-card
      v-if="currentIndex > -1"
      elevation="11"
      class="text-center"
    >
      <v-card-title>
        <v-row
          justify="center"
          no-gutters
        >
          <v-col
            cols="12"
            md="4"
          >
            <!-- <v-btn
              class="px-5 mx-1"
              rounded
              color="green"
              dark
            >
              Reveal the first word
            </v-btn> -->
          </v-col>
          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              v-model="answer"
              label="Your definition"
              placeholder="Type your answer"
              outlined
            >
              <v-icon
                v-if="answer == currentReview.definition"
                slot="append"
                color="green"
              >
                mdi-check
              </v-icon>
            </v-text-field>
            {{ isSpeaking ? "Speaking..." : diagnostic }}
          </v-col>
          <v-col
            cols="12"
            md="4"
          >
            <!-- <v-btn
              class="px-5 mx-1"
              rounded
              color="green"
              dark
            >
              Reveal the last word
            </v-btn> -->
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-expansion-panels
          v-model="panel"
          focusable
          multiple
        >
          <v-expansion-panel>
            <v-expansion-panel-header>
              {{
                $t("explanation")
              }}
            </v-expansion-panel-header>
            <v-expansion-panel-content class="pt-2">
              {{ currentReview.explanation }}
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>{{ $t('example') }}</v-expansion-panel-header>
            <v-expansion-panel-content class="pt-2">
              <span v-html="currentReview.example" />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
      <v-divider class="mx-4" />
      <v-card-actions class="justify-center white--text flex-sm-row flex-column">
        <v-btn
          class="px-5 mx-1 white--text my-1"
          rounded
          color="green"
          min-width="100"
          :disabled="answer == currentReview.definition"
          @click="reveal()"
        >
          {{ $t('reveal') }}
        </v-btn>
        <v-btn
          :disabled="answer != currentReview.definition"
          class="px-5 mx-1 my-1"
          rounded
          min-width="100"
          color="primary"
          @click="getNextReviewItem()"
        >
          {{ $t('next') }}
        </v-btn>
        <v-btn
          class="px-5 mx-1 my-1"
          rounded
          min-width="100"
          color="primary"
          @click="skipItem()"
        >
          {{ $t('skip') }}
        </v-btn>
      </v-card-actions>
    </v-card>
    <div v-else>
      There is nothing to review
    </div>
  </v-container>
</template>
<script>
import { NotesService } from "@/services/api.service";
// eslint-disable-next-line no-undef
//var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
//var SpeechGrammarList = SpeechGrammarList;
// eslint-disable-next-line no-undef
import { mapActions } from "vuex";

export default {
  name: "Review",
  data: function () {
    return {
      panel: [0],
      currentReview: {},
      currentOutcome: 2,
      hint: false,
      currentIndex: -1,
      answer: "",
      notes: [],
      diagnostic: "",
      isSpeaking: false,
      //recognition: new SpeechRecognition(),
    };
  },
  async created() {
    this.currentReview = this.notes[0];
    var reviewItemsResponse = await NotesService.getReviewNotes();
    if (reviewItemsResponse.statusText == "OK") {
      this.notes = reviewItemsResponse.data;
      if (this.notes.length > 0) {
        this.skipItem();
      }
    }

    // if (this.currentReview == null) {
    // var grammar =
    //   "#JSGF V1.0; grammar words; public <word> =  put | words | and phases | in here;";
    // var speechRecognitionList = new SpeechGrammarList();
    // speechRecognitionList.addFromString(grammar, 1);
    // this.recognition.grammars = speechRecognitionList;
    // this.recognition.continuous = false;
    // this.recognition.lang = "en-US";
    // this.recognition.interimResults = false;
    // this.recognition.maxAlternatives = 1;
    // }
  },
  methods: {
    ...mapActions("alert", ["turnOnErrorAlert"]),
    async getNextReviewItem() {
      if (!this.hint) this.currentOutcome = 3;

      var reviewResponse = await NotesService.submitReviewResult(
        this.currentReview.reviewCardId,
        { outcome: this.currentOutcome }
      );
      if (reviewResponse.statusText == "OK") {
        this.skipItem();
      }
    },
    reveal() {
      this.hint = true;
      this.answer = this.currentReview.definition
    },
    skipItem() {
      if (this.currentIndex + 1 < this.notes.length) {
        this.currentReview = this.notes[++this.currentIndex];
        this.hint = false;
        this.answer = "";
        this.currentOutcome = 2;
      } else {
        this.currentIndex = -1;
      }
    },
    showAnswer() {
      this.answer = this.currentReview.definition;
      this.currentOutcome = 1;
    },
  //   speak() {
  //     this.recognition.start();
  //     this.isSpeaking = true;

  //     var that = this;
  //     this.recognition.onresult = (event) => {
  //       that.diagnostic = event.results[0][0].transcript;

  //       if (
  //         that.diagnostic.toUpperCase() ==
  //         that.currentReview.definition.toUpperCase()
  //       ) {
  //         that.answer = that.currentReview.definition;
  //       }
  //     };

  //     this.recognition.onspeechend = () => {
  //       that.isSpeaking = false;
  //       that.recognition.stop();
  //     };

  //     this.recognition.onnomatch = () => {
  //       that.diagnostic = "I didn't recognise that color.";
  //     };

  //     this.recognition.onerror = () => {
  //       that.diagnostic = "Error occurred in recognition: " + event.error;
  //     };
  //     this.recognition.onend = () => {
  //       that.isSpeaking = false;
  //     }
  //   },
  }
};
</script>
<style lang="sass" scoped>
.v-application > p
  margin-bottom: 0px
</style>