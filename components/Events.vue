<template>
  <div id="events">
    <div id="events-header">
      <p>Events</p>
      <button @click="add_event">Add Event</button>
    </div>
    <table id="events-body">
      <thead>
        <tr>
          <th>Event</th>
          <th>Last Modified</th>
          <th colspan="3">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="e of events[selectedWebsite]" :key="e.key">
          <td>{{ e.title }}</td>
          <td v-if="e.eventLastEditedBy && e.eventLastEditedDate">
            {{ new Date(eventLastEditedDate) }} by {{ e.eventLastEditedBy }}
          </td>
          <td v-else>a</td>
          <td><button @click="view_event">View</button></td>
          <td><button @click="edit_event">Edit</button></td>
          <td><button @click="delete_event">Delete</button></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'Events',
  props: {
    events: {
      type: Object,
      default() {
        return {}
      }
    },
    selectedWebsite: {
      type: String,
      default: ''
    }
  },
  methods: {
    add_event() {
      return ''
    },
    view_event() {
      return ''
    },
    edit_event() {
      return ''
    },
    delete_event() {
      if (confirm('Are you sure you with to delete this event?')) return ''
    }
  }
}
</script>

<style scoped>
#events {
  width: 800px;
}

#events-header {
  display: flex;
  background-color: #ededed;
}

#events-body {
  background-color: #f5f5f5;
  display: block;
}

#events-table-header {
  display: flex;
}
</style>
