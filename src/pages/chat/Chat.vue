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
    <q-page >
    <div
      class="bg-white row border-grey fit"
      style="min-height: 500px;"
      :style="dom.divSize ?
        `min-height: ${dom.divSize}px !important; max-height: ${dom.divSize}px !important;` : ''"
    >
      <q-list
        bordered
        class="rounded-borders full-height"
        :class="$q.platform.is.desktop ? 'col-3' : 'col-12'"
        :style="`max-height: ${dom.chatContainerHeight}px`"
        v-if="$q.platform.is.desktop
          || (!activeFriend.id)"
      >
        <q-item-label header>{{ $tc('friend', 2) }}</q-item-label>

          <q-item
            clickable
            v-ripple
            @click="friendSelect(friend)"
            v-for="friend in friends"
            v-bind:key="friend.user.id"
            :class="activeFriend.id === friend.user.id ? 'bg-grey-4' : ''"
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

              <q-item-label
                class="text-weight-bold"
                caption
                v-if="friend.unreadMessages > 0"
              >
                <q-badge color="deep-purple">
                  {{ friend.unreadMessages }}
                </q-badge>
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-separator inset="item" />

      </q-list>

      <div
        class="bg-deep-purple-1 border border-grey-left column reverse"
        :class="!$q.platform.is.desktop ? 'col-12' : 'col-9'"
        v-if="$q.platform.is.desktop
          || activeFriend.id"
      >
        <div
          :class="!$q.platform.is.desktop ? 'fixed-bottom' : ''"
          :style="!$q.platform.is.desktop ? 'z-index: 9999;' : ''">
          <q-input
            class="q-px-xl q-pt-md bg-white"
            outlined
            bottom-slots
            :label="$tc('message')"
            maxlength="120"
            counter
            color="dark-purple"
            bg-color="deep-purple-1"
            :loading="sendingMessage"
            v-model="textMessage"
            :disable="sendingMessage"
            @keyup.enter.native="sendMessage"
          >
            <template v-slot:after>
              <q-btn round dense flat icon="send" @click="sendMessage" />
            </template>
          </q-input>
        </div>
        <div
          ref="chatContainer"
          class="self-center"
          style="width: 100%; overflow-y: auto;"
          :style="!$q.platform.is.desktop ?
           `margin-bottom: 100px; max-height: ${dom.chatContainerHeight}px`
           : `max-height: ${dom.chatContainerHeight}px`"
        >
          <div
            v-for="(message, index) in messages"
            v-bind:key="message.id"
          >
            <q-chat-message
              v-if="!messages[index-1]
                || $formatDate(messages[index-1].sentAt, 'DD, MMM') !==
                  $formatDate(message.sentAt, 'DD, MMM')"
              :label="$formatDate(message.sentAt, 'DD, MMM')"
            />

            <q-chat-message
              :ref="message.id"
              :sent="user.id === message.sentBy.userId"
              :name="`${message.sentBy.name} ${message.sentBy.lastName}`"
              :text="[ message.text ]"
              size="5"
              :text-color="user.id === message.sentBy.userId ? 'black' : 'white'"
              :bg-color="user.id === message.sentBy.userId ? 'white' : 'deep-purple-3'"
              :stamp="$dateFromNow(message.sentAt)"
            >
              <user-avatar
                class="q-mx-xs"
                slot="avatar"
                :user-id="message.sentBy.userId"
                size="48px"
              />
            </q-chat-message>

          </div>
        </div>
        <q-infinite-scroll
          ref="chatContainerScroll"
          @load="onLoad"
          reverse
          :scroll-target="$refs.chatContainer"
        >
          <!-- <template v-slot:loading>
            <div class="row justify-center q-my-md">
              <q-spinner-dots color="primary" size="40px" />
            </div>
          </template> -->
        </q-infinite-scroll>
      </div>
    </div>

  </q-page>
</template>

<script>
import { uid } from 'quasar';
import UserAvatar from '../../components/UserAvatar';

export default {
  name: 'Chat',
  components: {
    UserAvatar,
  },
  created() {
    this.$q.screen.setSizes({
      sm: 300,
      md: 750,
      lg: 1500,
      xl: 3000,
    });

    this.$store.dispatch(
      'stomp/subscribe',
      {
        name: 'message',
        destination: '/user/queue/message',
        callback: (message/* , context */) => {
          const payload = JSON.parse(message.body);

          let tempMessage;
          let friendToUpdate;
          let toUnreadMessages;

          if (payload.hash) {
            this.$store.dispatch('chat/deleteSentMessage', payload.hash);

            tempMessage = this.messages.find(m => m.id === payload.hash);
            tempMessage.id = payload.id;

            friendToUpdate = payload.sendTo;
          } else {
            if (payload.sentBy.userId === this.activeFriend.id) {
              this.messages.push(payload);

              // If it's from the friend the user is chatting with, read message
              const headers = this.$getStompHeaders();
              headers.id = `${this.user.username}-read-message`;
              this.$store.dispatch(
                'stomp/send',
                {
                  destination: '/ws/read-message',
                  body: payload.id,
                  headers,
                },
              );
            } else {
              toUnreadMessages = true;
            }

            tempMessage = payload;
            friendToUpdate = payload.sentBy.userId;
          }

          const friend = this.friends.find(f => f.user.id === friendToUpdate);
          friend.lastMessage = tempMessage;
          if (toUnreadMessages) {
            friend.unreadMessages += 1;
          }
          this.scrollChatToBottom();
        },
      },
    );

    this.$axios.get('relationships/friends').then((resp) => {
      this.friends = resp.data;
      if (this.$q.platform.is.desktop && this.friends.length > 0) {
        this.friendSelect(this.friends[0]);
      }
    });

    const second = 1000;
    const minute = second * 60;
    setInterval(() => this.updateMessages(), minute);
  },
  data() {
    let divSize;
    let chatContainerHeight;
    const sizeLt = this.$q.screen.lt;

    if (this.$q.platform.is.desktop) {
      if (sizeLt.lg) {
        divSize = 600;
        chatContainerHeight = 500;
      } else if (sizeLt.xl) {
        divSize = 750;
        chatContainerHeight = 650;
      }
    } else {
      divSize = this.$q.screen.height - 50;
      chatContainerHeight = this.$q.screen.height - 50;
    }

    return {
      user: this.$store.getters['auth/getAccount'],
      friends: [],
      activeFriend: {},
      messages: [],
      textMessage: '',
      sendingMessage: false,
      limit: undefined,
      dom: {
        divSize,
        chatContainerHeight,
      },
    };
  },
  methods: {
    friendSelect(friend) {
      this.activeFriend = friend.user;

      this.limit = 0;
      this.messages = [];

      if (!this.$q.platform.is.desktop) {
        this.$root.$emit(
          'addBackButton',
          () => {
            this.activeFriend = {};
          },
        );

        this.$root.$emit(
          'addTitle',
          {
            avatar: this.activeFriend.id,
            title: `${this.activeFriend.name} ${this.activeFriend.lastName}`,
            clearOnBack: true,
          },
        );
      }

      const chatScroll = this.$refs.chatContainerScroll;

      if (chatScroll) {
        chatScroll.resume();
        chatScroll.poll();
      }
    },
    sendMessage() {
      const messageToSend = this.textMessage;
      this.textMessage = '';

      const headers = this.$getStompHeaders();
      headers.id = `${this.user.username}-send-message`;
      const payload = {
        hash: uid(),
        chatGroup: null,
        text: messageToSend,
        sendTo: this.activeFriend.id,
        isGroup: false,
        isSent: false,
      };
      this.$store.dispatch(
        'stomp/send',
        {
          destination: '/ws/message',
          body: payload,
          headers,
        },
      );

      this.$store.dispatch('chat/sendMessage', payload);

      this.messages.push({
        id: payload.hash,
        chatGroup: null,
        excludedAt: null,
        isGroup: false,
        readBy: [],
        readByAll: false,
        sentAt: new Date(),
        sentBy: {
          userId: this.user.id,
          name: this.user.name,
          lastName: this.user.lastName,
        },
        sentTo: [
          {
            userId: this.activeFriend.id,
            name: this.activeFriend.name,
            lastName: this.activeFriend.lastName,
          },
        ],
        text: payload.text,
        updatedAt: null,
      });

      this.scrollChatToBottom();
    },
    scrollChatToBottom() {
      setTimeout(() => {
        this.$refs.chatContainer.scrollTop = this.$refs.chatContainer.scrollHeight;

        if (!this.$q.platform.is.desktop) {
          window.scrollTo(0, document.body.scrollHeight);
        }
      }, 0);
    },
    updateMessages(additionalLimit, done, firstPassing) {
      if (this.activeFriend.id) {
        this.$axios.get(`chat/private/${this.user.id}/${this.activeFriend.id}/messages`,
          { params: { limit: this.limit + (additionalLimit || 0) } }).then((resp) => {
          this.messages = resp.data.messages.reverse();
          this.limit = resp.data.limit;

          if (firstPassing) {
            this.friends.find(f => f.user.id === this.activeFriend.id).unreadMessages = 0;
            this.scrollChatToBottom();
          }
          if (this.messages.length === this.limit) {
            this.$refs.chatContainerScroll.stop();
          }
          if (typeof done === 'function') done();
        });
      }
    },
    onLoad(index, done) {
      const firstPassing = !this.limit;
      this.limit = this.limit || 0;

      if (this.activeFriend && this.activeFriend.id) {
        this.updateMessages(30, done, firstPassing);
      } else {
        done();
      }
    },
  },
};
</script>
