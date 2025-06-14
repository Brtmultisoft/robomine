// vite.config.mjs
import path from "path";
import { defineConfig } from "file:///C:/Users/dev1/Desktop/robomine_updated/robomine/user/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/dev1/Desktop/robomine_updated/robomine/user/node_modules/@vitejs/plugin-react/dist/index.mjs";
import jsconfigPaths from "file:///C:/Users/dev1/Desktop/robomine_updated/robomine/user/node_modules/vite-jsconfig-paths/dist/index.mjs";
import { loadEnv } from "file:///C:/Users/dev1/Desktop/robomine_updated/robomine/user/node_modules/vite/dist/node/index.js";
var vite_config_default = ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return defineConfig({
    plugins: [react(), jsconfigPaths()],
    // https://github.com/jpuri/react-draft-wysiwyg/issues/1317
    base: process.env.VITE_APP_BASE_NAME,
    define: {
      global: "window",
      "process.env": env
    },
    resolve: {
      alias: [
        {
          find: /^~(.+)/,
          replacement: path.join(process.cwd(), "node_modules/$1")
        },
        {
          find: /^src(.+)/,
          replacement: path.join(process.cwd(), "src/$1")
        }
      ]
    },
    server: {
      // this ensures that the browser opens upon server start
      open: true,
      // this sets a default port to 3000
      port: 4001
    },
    preview: {
      // this ensures that the browser opens upon preview start
      open: true,
      // this sets a default port to 3000
      port: 4001
    }
  });
};
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubWpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcZGV2MVxcXFxEZXNrdG9wXFxcXHJvYm9taW5lX3VwZGF0ZWRcXFxccm9ib21pbmVcXFxcdXNlclwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcZGV2MVxcXFxEZXNrdG9wXFxcXHJvYm9taW5lX3VwZGF0ZWRcXFxccm9ib21pbmVcXFxcdXNlclxcXFx2aXRlLmNvbmZpZy5tanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2RldjEvRGVza3RvcC9yb2JvbWluZV91cGRhdGVkL3JvYm9taW5lL3VzZXIvdml0ZS5jb25maWcubWpzXCI7Ly8gaHR0cHM6Ly9naXRodWIuY29tL3ZpdGVqcy92aXRlL2Rpc2N1c3Npb25zLzM0NDhcclxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xyXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xyXG5pbXBvcnQganNjb25maWdQYXRocyBmcm9tICd2aXRlLWpzY29uZmlnLXBhdGhzJztcclxuaW1wb3J0IHsgbG9hZEVudiB9IGZyb20gXCJ2aXRlXCI7XHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbmV4cG9ydCBkZWZhdWx0ICh7IG1vZGUgfSkgPT4ge1xyXG4gIGNvbnN0IGVudiA9IGxvYWRFbnYobW9kZSwgcHJvY2Vzcy5jd2QoKSwgXCJcIik7XHJcbiAgcmV0dXJuIGRlZmluZUNvbmZpZyh7XHJcbiAgICBwbHVnaW5zOiBbcmVhY3QoKSwganNjb25maWdQYXRocygpXSxcclxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9qcHVyaS9yZWFjdC1kcmFmdC13eXNpd3lnL2lzc3Vlcy8xMzE3XHJcbiAgICBiYXNlOiBwcm9jZXNzLmVudi5WSVRFX0FQUF9CQVNFX05BTUUsXHJcbiAgICBkZWZpbmU6IHtcclxuICAgICAgZ2xvYmFsOiAnd2luZG93JyxcclxuICAgICAgXCJwcm9jZXNzLmVudlwiOiBlbnZcclxuICAgIH0sXHJcbiAgICByZXNvbHZlOiB7XHJcbiAgICAgIGFsaWFzOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgZmluZDogL15+KC4rKS8sXHJcbiAgICAgICAgICByZXBsYWNlbWVudDogcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICdub2RlX21vZHVsZXMvJDEnKVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgZmluZDogL15zcmMoLispLyxcclxuICAgICAgICAgIHJlcGxhY2VtZW50OiBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ3NyYy8kMScpXHJcbiAgICAgICAgfVxyXG4gICAgICBdXHJcbiAgICB9LFxyXG4gICAgc2VydmVyOiB7XHJcbiAgICAgIC8vIHRoaXMgZW5zdXJlcyB0aGF0IHRoZSBicm93c2VyIG9wZW5zIHVwb24gc2VydmVyIHN0YXJ0XHJcbiAgICAgIG9wZW46IHRydWUsXHJcbiAgICAgIC8vIHRoaXMgc2V0cyBhIGRlZmF1bHQgcG9ydCB0byAzMDAwXHJcbiAgICAgIHBvcnQ6IDQwMDFcclxuICAgIH0sXHJcbiAgICBwcmV2aWV3OiB7XHJcbiAgICAgIC8vIHRoaXMgZW5zdXJlcyB0aGF0IHRoZSBicm93c2VyIG9wZW5zIHVwb24gcHJldmlldyBzdGFydFxyXG4gICAgICBvcGVuOiB0cnVlLFxyXG4gICAgICAvLyB0aGlzIHNldHMgYSBkZWZhdWx0IHBvcnQgdG8gMzAwMFxyXG4gICAgICBwb3J0OiA0MDAxXHJcbiAgICB9XHJcbiAgfSlcclxufVxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQ0EsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sV0FBVztBQUNsQixPQUFPLG1CQUFtQjtBQUMxQixTQUFTLGVBQWU7QUFHeEIsSUFBTyxzQkFBUSxDQUFDLEVBQUUsS0FBSyxNQUFNO0FBQzNCLFFBQU0sTUFBTSxRQUFRLE1BQU0sUUFBUSxJQUFJLEdBQUcsRUFBRTtBQUMzQyxTQUFPLGFBQWE7QUFBQSxJQUNsQixTQUFTLENBQUMsTUFBTSxHQUFHLGNBQWMsQ0FBQztBQUFBO0FBQUEsSUFFbEMsTUFBTSxRQUFRLElBQUk7QUFBQSxJQUNsQixRQUFRO0FBQUEsTUFDTixRQUFRO0FBQUEsTUFDUixlQUFlO0FBQUEsSUFDakI7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLE9BQU87QUFBQSxRQUNMO0FBQUEsVUFDRSxNQUFNO0FBQUEsVUFDTixhQUFhLEtBQUssS0FBSyxRQUFRLElBQUksR0FBRyxpQkFBaUI7QUFBQSxRQUN6RDtBQUFBLFFBQ0E7QUFBQSxVQUNFLE1BQU07QUFBQSxVQUNOLGFBQWEsS0FBSyxLQUFLLFFBQVEsSUFBSSxHQUFHLFFBQVE7QUFBQSxRQUNoRDtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSxRQUFRO0FBQUE7QUFBQSxNQUVOLE1BQU07QUFBQTtBQUFBLE1BRU4sTUFBTTtBQUFBLElBQ1I7QUFBQSxJQUNBLFNBQVM7QUFBQTtBQUFBLE1BRVAsTUFBTTtBQUFBO0FBQUEsTUFFTixNQUFNO0FBQUEsSUFDUjtBQUFBLEVBQ0YsQ0FBQztBQUNIOyIsCiAgIm5hbWVzIjogW10KfQo=
