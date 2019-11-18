<template>
    <q-page>

    <div
      class="bg-white q-ma-md row"
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
            v-for="friend in friendList"
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
                {{ $dateFromNow(friend.lastMessage.createdAt) }}
              </q-item-label>
              <q-item-label>
                <q-icon name="style" size="xs"/>
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-separator inset="item" />

      </q-list>

      <div
        class="bg-grey-3 border col-12 col-lg-9"
        :class="!$q.platform.is.desktop ? 'hidden' : ''"
      >

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
      this.friendList = resp.data;
    });
  },
  data() {
    return {
      friendList: [],
      activeFriend: null,
    };
  },
  methods: {
    friendSelect(friend) {
      this.activeFriend = friend.user.id;
      console.log('friendSelect');
    },
  },
};
</script>
