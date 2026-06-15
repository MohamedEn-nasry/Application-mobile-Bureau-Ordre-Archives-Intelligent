FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# 1. نسخ ملفات الـ csproj لكافة المشاريع لتهيئة الـ Restore
COPY ["Presentation/backend.csproj", "Presentation/"]
COPY ["Business Layer/BusinessLayer.csproj", "Business Layer/"]
COPY ["DTO/DTO.csproj", "DTO/"]
COPY ["Data Access/Data Access.csproj", "Data Access/"]

# 2. عمل Restore للمشروع الأساسي والاعتمادات الشقيقة تلقائياً
RUN dotnet restore "Presentation/backend.csproj"

# 3. نسخ بقية الكود المصدري للمجلد بالكامل وبناء المشروع
COPY . .
WORKDIR "/src/Presentation"
RUN dotnet build -c Release -o /app/build

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app

# تثبيت Tesseract OCR لبيئة Linux لتفادي خطأ DllNotFoundException
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    libtesseract-dev \
    && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/build .

EXPOSE 80 443

ENTRYPOINT ["dotnet", "backend.dll"]