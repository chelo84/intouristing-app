<template>
    <q-page>

    <div
      class="bg-white q-ma-md row"
      :style="$q.platform.is.desktop ? 'min-height: 800px;' : 'min-height: 450px;'"
    >
      <q-list
        bordered
        class="rounded-borders col-12 col-lg-4 full-height"
      >
        <q-item-label header>{{ $tc('friend', 2) }}</q-item-label>

          <q-item
            clickable
            v-ripple
            @click="itemClick"
            v-for="friend in friendList"
            v-bind:key="friend.user.id"
          >
            <q-item-section avatar>
              <user-avatar :user-id="friend.user.id" size="48px"/>
            </q-item-section>

            <q-item-section>
              <q-item-label lines="1">
                {{ friend.user.name }} {{ friend.user.lastName }}
              </q-item-label>
              <q-item-label caption lines="2">
                {{ friend.lastMessage.text }}
              </q-item-label>
            </q-item-section>

            <q-item-section lines="2" side top>
              <div>
                {{ $dateFromNow(friend.lastMessage.createdAt) }}
              </div>
              <div>
                <q-icon name="style" size="xs"/>
              </div>
            </q-item-section>
          </q-item>

          <q-separator inset="item" />

      </q-list>

      <div
        class="bg-black col-12 col-lg-8"
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
    };
  },
  methods: {
    itemClick() {
      console.log('itemClick');
    },
  },
};
</script>
