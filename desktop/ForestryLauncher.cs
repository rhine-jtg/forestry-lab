using System;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Reflection;
using System.Text;
using System.Threading;
using System.Windows.Forms;

internal static class ForestryLauncher
{
    private const string CacheFolder = "ForestryLab\\web-0.1.0";

    [STAThread]
    private static void Main()
    {
        TcpListener server = null;
        try
        {
            string cacheRoot = Path.Combine(Path.GetTempPath(), CacheFolder);
            Directory.CreateDirectory(cacheRoot);

            WriteResource("ForestryLab.index.html", Path.Combine(cacheRoot, "index.html"));
            WriteResource("ForestryLab.styles.css", Path.Combine(cacheRoot, "styles.css"));
            WriteResource("ForestryLab.app.js", Path.Combine(cacheRoot, "app.js"));

            server = new TcpListener(IPAddress.Loopback, 0);
            server.Start();
            int port = ((IPEndPoint)server.LocalEndpoint).Port;

            Thread serverThread = new Thread(() => ServeLocalFiles(server, cacheRoot));
            serverThread.IsBackground = false;
            serverThread.Start();

            Process.Start(new ProcessStartInfo
            {
                FileName = "http://127.0.0.1:" + port + "/index.html",
                UseShellExecute = true
            });

            serverThread.Join();
        }
        catch (Exception error)
        {
            if (server != null)
            {
                server.Stop();
            }
            MessageBox.Show(
                "林业模拟器启动失败：\n" + error.Message,
                "林业模拟器",
                MessageBoxButtons.OK,
                MessageBoxIcon.Error);
        }
    }

    private static void ServeLocalFiles(TcpListener server, string root)
    {
        while (true)
        {
            TcpClient client;
            try
            {
                client = server.AcceptTcpClient();
            }
            catch (SocketException)
            {
                return;
            }

            using (client)
            using (NetworkStream stream = client.GetStream())
            {
                try
                {
                    string request = ReadRequest(stream);
                    string[] requestLine = request.Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);
                    string requestPath = requestLine.Length > 1 ? requestLine[1] : "/index.html";
                    requestPath = requestPath.Split('?')[0];
                    requestPath = Uri.UnescapeDataString(requestPath).Replace('/', '\\').TrimStart('\\');

                    if (requestPath.Length == 0)
                    {
                        requestPath = "index.html";
                    }

                    if (requestPath.Contains(".."))
                    {
                        WriteResponse(stream, 403, "text/plain; charset=utf-8", Encoding.UTF8.GetBytes("Forbidden"));
                        continue;
                    }

                    string filePath = Path.Combine(root, requestPath);
                    if (!File.Exists(filePath))
                    {
                        WriteResponse(stream, 404, "text/plain; charset=utf-8", Encoding.UTF8.GetBytes("Not found"));
                        continue;
                    }

                    WriteResponse(stream, 200, ContentType(filePath), File.ReadAllBytes(filePath));
                }
                catch (IOException)
                {
                    // Browsers can close a connection while the page is loading.
                }
            }
        }
    }

    private static string ReadRequest(NetworkStream stream)
    {
        byte[] buffer = new byte[1024];
        using (MemoryStream request = new MemoryStream())
        {
            while (request.Length < 8192)
            {
                int count = stream.Read(buffer, 0, buffer.Length);
                if (count <= 0)
                {
                    break;
                }

                request.Write(buffer, 0, count);
                if (Encoding.ASCII.GetString(buffer, 0, count).Contains("\r\n\r\n"))
                {
                    break;
                }
            }

            return Encoding.ASCII.GetString(request.ToArray());
        }
    }

    private static void WriteResponse(NetworkStream stream, int statusCode, string contentType, byte[] body)
    {
        string statusText = statusCode == 200 ? "OK" : (statusCode == 403 ? "Forbidden" : "Not Found");
        string headers = "HTTP/1.1 " + statusCode + " " + statusText + "\r\n"
            + "Content-Type: " + contentType + "\r\n"
            + "Content-Length: " + body.Length + "\r\n"
            + "Cache-Control: no-store\r\n"
            + "Connection: close\r\n\r\n";
        byte[] headerBytes = Encoding.ASCII.GetBytes(headers);
        stream.Write(headerBytes, 0, headerBytes.Length);
        stream.Write(body, 0, body.Length);
    }

    private static string ContentType(string path)
    {
        switch (Path.GetExtension(path).ToLowerInvariant())
        {
            case ".html": return "text/html; charset=utf-8";
            case ".css": return "text/css; charset=utf-8";
            case ".js": return "text/javascript; charset=utf-8";
            default: return "application/octet-stream";
        }
    }

    private static void WriteResource(string resourceName, string targetPath)
    {
        Assembly assembly = Assembly.GetExecutingAssembly();
        using (Stream source = assembly.GetManifestResourceStream(resourceName))
        {
            if (source == null)
            {
                throw new InvalidOperationException("缺少内嵌资源：" + resourceName);
            }

            using (FileStream target = File.Create(targetPath))
            {
                source.CopyTo(target);
            }
        }
    }
}
