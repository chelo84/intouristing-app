<style scoped>
  .border-grey {
    border: 2px solid #ccc;
  }

  .border-grey-left {
    border: solid #ccc;
    border-width: 0 0 0 1px;
  }
</style>

<template>
    <q-page>

    <div
      class="bg-white q-ma-md row border-grey"
      :style="$q.platform.is.desktop ? 'min-height: 800px;' : 'min-height: 450px;'"
    >
      <q-list
        bordered
        class="rounded-borders col-12 col-lg-3 full-height"
      >
        <q-item-label header>{{ $tc('friend', 2) }}</q-item-label>

          <q-item
            clickable
            v-ripple
            @click="friendSelect(friend)"
            v-for="friend in friends"
            v-bind:key="friend.user.id"
            :class="activeFriend === friend.user.id ? 'bg-grey-4' : ''"
          >
            <q-item-section avatar>
              <user-avatar :user-id="friend.user.id" size="48px"/>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-weight-bold" lines="1">
                {{ friend.user.name }} {{ friend.user.lastName }}
              </q-item-label>
              <q-item-label
                class="text-weight-bold text-grey-7"
                caption
                lines="2"
                v-if="friend.lastMessage"
              >
                {{ friend.lastMessage.text }}
              </q-item-label>
            </q-item-section>

            <q-item-section lines="2" side bottom v-if="friend.lastMessage">
              <q-item-label class="text-weight-bold" caption>
                {{ $dateFromNow(friend.lastMessage.sentAt) }}
              </q-item-label>
              <q-item-label>
                <q-icon name="style" size="xs"/>
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-separator inset="item" />

      </q-list>

      <div
        class="bg-grey-3 border col-12 col-lg-9 border-grey-left row justify-center"
        :class="!$q.platform.is.desktop ? 'hidden' : ''"
      >
        <div class="q-pa-md row">
          <div style="width: 100%; max-width: 400px;">
            <q-chat-message
              v-for="message in messages"
              v-bind:key="message.id"
              avatar="https://cdn.quasar.dev/img/avatar1.jpg"
              :sent="user.id === message.sentBy.userId"
              :name="`${message.sentBy.name} ${message.sentBy.lastName}`"
              :text="[ message.text ]"
              size="6"
              :bg-color="user.id === message.sentBy.userId ? 'white' : 'deep-purple-3'"
              :stamp="$dateFromNow(message.sentAt)"
            />
          </div>
        </div>
      </div>
    </div>

  </q-page>
</template>

<script>
import UserAvatar from '../../components/UserAvatar';

export default {
  name: 'Chat',
  components: {
    UserAvatar,
  },
  created() {
    this.$axios.get('relationships/friends').then((resp) => {
      this.friends = resp.data;
      if (this.$q.platform.is.desktop) {
        this.friendSelect(this.friends[0]);
      }
    });
  },
  data() {
    return {
      user: this.$store.getters['auth/getAccount'],
      friends: [],
      activeFriend: null,
      messages: [],
    };
  },
  methods: {
    friendSelect(friend) {
      this.activeFriend = friend.user.id;

      this.$axios.get(`chat/private/${this.user.id}/${this.activeFriend}/messages`).then((resp) => {
        console.log(resp);
        this.messages = resp.data;
      });
    },
  },
};
</script>
