import axios from "axios";
import { API_URL, youtubeAPI } from "@/app.config.js";

// Set config defaults when creating the instance
var instance = axios.create({
  withCredentials: true,
  baseURL: API_URL
});

var STS_DOMAIN = process.env.VUE_APP_STS_DOMAIN || 'https://localhost:5001';

instance.interceptors.request.use(request => {
  //store.commit('TURN_ON_LOADING');
  return request;
}, error => {
  console.log(error);
  return Promise.reject(error);
});

instance.interceptors.response.use((response) => {
  //store.commit('TURN_OFF_LOADING');
  return response;
}, (error) => {
  if (error.response && error.response.data) {
      return Promise.reject(error.response.data);
  }
  return Promise.reject(error.message);
});


const ApiService = {

  async setHeader(authService) {
    var accessToken = await authService.getAccessToken();
    // eslint-disable-next-line no-debugger
    instance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    // Vue.axios.defaults.headers.common[
    //   "Authorization"
    // ] = `Token ${accessToken}`;
  },

  query(resource, params) {
    return instance.get(resource, params).catch(error => {
      throw new Error(`[RWV] ApiService ${error}`);
    });
  },

  queryFromURL(url) {
    return axios.get(url, {withCredentials: true}).catch(error => {
      throw new Error(`[RWV] ApiService ${error}`);
    });
  },

  get(resource) {
    return instance.get(`${resource}`).catch(error => {
      throw new Error(`[RWV] ApiService ${error}`);
    });
  },

  post(resource, params) {
    return instance.post(`${resource}`, params);
  },
  
  put(resource, params) {
    return instance.put(`${resource}`, params);
  },

  delete(resource) {
    return instance.delete(resource).catch(error => {
      throw new Error(`[RWV] ApiService ${error}`);
    });
  }
};

export default ApiService;

export const DashboardService = {
  query(params) {
    return ApiService.query("Dashboard", {
        params: params
      });
  }
};

export const NotesService = {
    query(params) {
      return ApiService.get("Notes", {
          params: params
        });
    },
    getReviewNotes() {
      return ApiService.get("Notes/Review");
    },
    getMyNotes() {
      return ApiService.get("Notes/MyNotes");
    },
    submitReviewResult(id, params){
      return ApiService.post(`Notes/${id}/Review`, params);
    },
    get(id) {
      return ApiService.get(`Notes/${id}`);
    },
    create(params) {
      return ApiService.post("Notes/", params);
    },
    update(id, params) {
      return ApiService.put(`Notes/${id}`, params);
    },
    delete(id) {
      return ApiService.delete(`Notes/${id}`);
    }
  };

export const UserVideosService = {
  query(params) {
    return ApiService.get("UserVideos", {
        params: params
      });
  },
  get(id) {
    return ApiService.get(`UserVideos/${id}`);
  },
  create(params) {
    return ApiService.post("UserVideos", params);
  },
  update(id, params) {
    return ApiService.put(`UserVideos/${id}`, params);
  },
  learn(id) {
    return ApiService.put(`UserVideos/${id}/learning`);
  }
};

export const VideosService = {
  myVideos(params) {
    return ApiService.query("videos/myVideos", {
      params: params
    });
  },
  query(params) {
    return ApiService.query("videos", {
      params: params
    });
  },
  search(params) {
    return ApiService.query("videos/search", {
      params: params
    });
  },
  get(id) {
    return ApiService.get(`videos/${id}`);
  },
  getYoutubeVideo(params) {
    var yParams = Object.assign(params, {part:'snippet',key:'AIzaSyArZpwZ1yTI85x5azl2lNEz-wH1zD9zGfU'});
    return axios.get(youtubeAPI, {
      params: yParams
    });
  },
  create(params) {
    return ApiService.post("videos", params);
  },
  update(id, params) {
    return ApiService.put(`videos/${id}`, params);
  },
  delete(id) {
    return ApiService.delete(`videos/${id}`);
  }
};

export const SettingsService = {
  getSettingsOfCurrentUser() {
    return ApiService.get(`settings/ofCurrentUser`);
  },
  create(params) {
    return ApiService.post("settings", params);
  },
  update(id, params) {
    return ApiService.put(`settings/${id}`, params);
  },
};

export const ChannelsService = {
  query(params) {
    return ApiService.query("channels", {
      params: params
    });
  },
};

export const MetaService = {
  getLearningLanguages() {
    return ApiService.get('Meta/display-languages');
  }
};

export const ProfileService = {
  update(params) {
    return ApiService.put('profile', params);
  },
  get() {
    return ApiService.queryFromURL(`${STS_DOMAIN}/account/profile`);
  }
}

