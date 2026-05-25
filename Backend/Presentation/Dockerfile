FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src


COPY ["backend.csproj", "./"]
RUN dotnet restore

COPY . .
RUN dotnet build -c Release -o /app/build

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app

COPY --from=build /app/build .

EXPOSE 80 443

ENTRYPOINT ["dotnet", "backend.dll"]