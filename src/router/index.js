import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Review from '../views/Review.vue'
import Video from '../views/Video.vue'
import MyLearning from '../views/MyLearning.vue'
import ErrorMessage from '../views/ErrorMessage.vue'
import Notes from '../views/Notes.vue'
import Settings from '../views/Settings.vue'
import Home from '../views/Home.vue'
import AuthService from '@/services/auth.service';
import store from '../store/index.js';

const auth = new AuthService();

Vue.use(VueRouter)

const routes = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    meta: {
      title: 'Dashboard',
      requiresAuth: true
    },
    component: Dashboard
  },
  {
    path: '/',
    name: 'Home',
    meta: {
      title: 'Home',
    },
    component: Home
  },
  {
    path: '/review',
    name: 'Review',
    meta: {
      title: 'Review',
      requiresAuth: true

    },
    component: Review
  },
  {
    path: '/videos/create',
    name: 'CreateNewVideoMarker',
    meta: {
      title: 'Create a new video',
      requiresAuth: true

    },
    component: Video
  },
  {
    path: '/videos/:id/:creatorId',
    name: 'ViewVideoMarker',
    meta: {
      title: 'View video'
    },
    props: true,
    component: Video
  },
  {
    path: '/myLearning',
    name: 'MyLearning',
    meta: {
      title: 'My videos',
      requiresAuth: true
    },
    component: MyLearning
  },
  // {
  //   path: '/paragraphs/create',
  //   name: 'CreateNewParagraph',
  //   meta: {
  //     title: 'Create a new paragraph'
  //   },
  //   component: Paragraph,
  //   beforeEnter: authenticationGuard
  // },
  {
    path: '/notes',
    name: 'Notes',
    meta: {
      title: 'Your notes',
      requiresAuth: true
    },
    component: Notes
  },
  {
    path: '/settings',
    name: 'Settings',
    meta: {
      title: 'Settings',
      requiresAuth: true

    },
    component: Settings
  },
  {
    path: '/error/:errorType',
    name: 'ErrorMessage',
    props: true,
    component: ErrorMessage
  }
]

const router = new VueRouter({
  routes
});

router.beforeEach(async(to, from, next) => {
  document.title = to.meta.title || 'eMarker';
  var user = await auth.getUser();
  if (user && !user.expired) {
    //console.log(await auth.getAccessToken());
    if (to.name != 'ErrorMessage' && user.profile.idp == 'local' && !store.state.user.currentUser.profile.email_verified) {
      next({ name: 'ErrorMessage', params: { errorType: 'VerifyEmail' }  });
    }
    next();
  } else if (to.matched.some(record => record.meta.requiresAuth)) {
    auth.login().catch((error) => {
      store.dispatch("alert/turnOnErrorAlert", error.message);
    });
  } else {
    //No auth required. We can navigate
    next();
  }
})

export default router
